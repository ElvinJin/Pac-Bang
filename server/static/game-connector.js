/**
 * Created by tanghaomo on 15/5/10.
 */
var wrap = wrapper.wrap;

/**
 * Creates a game connector instance.
 * @class GameConnector
 */

/**
 * The status of a user.
 * @typedef {Object} UserInf
 * @property {string} name - Name of the user
 * @property {number} hp - HP of the player
 * @property {number} score - Score of the player
 * @property {number} bullet - Number of bullet of the player.
 */
/**
 * @typedef {Object} BulletStatus
 * @property {number} px - Position X
 * @property {number} py - Position Y
 * @property {number} vx - Velocity X
 * @property {number} vy - Velocity Y
 *
 */
var GameConnector = function(){
    var cur = this;
    cur.socket = io();
    cur.connected = false;
    cur.session = null;
    cur.uesrname = null;
    cur.waitting = {};

    cur.socket.on('message', function(msg){
        var callback = cur.waitting[msg.id];
        if (callback && typeof(callback) == 'function'){
            callback(msg);
            delete cur.waitting[msg.id];
            return;
        }
        cur.customEvent(msg.type, msg);

    });

    /**
     * The event indicate that the game should be started.
     *
     * @event gameStart
     */
    /**
     * The event indicate that the game should be stopped.
     *
     * @event gameEnd
     * @type {UserInf[]}
     */
    /**
     * The event indicate that a bullet is emitted by other user.
     *
     * @event counterPartyEmit
     * @type {BulletStatus}
     */
};

/**
 * Login to game server
 * @memberof GameConnector
 * @param {string} username - Unique username
 * @param {string} session - The session from page login.
 * @param {simpleCallback} [callback] - The callback that will be triggered after server's response arrival
 */
GameConnector.prototype.login = function(username, session, callback){
    var cur = this;
    var socket = this.socket;
    var msg = wrap({username:username, session: session}, 'hello');
    cur.waitting[msg.id] = function(msg){
        delete cur.waitting[msg.id];
        if (msg.con == 'ok'){
            cur.connected = true;
            cur.username = username;
            cur.session = session;
        }
        if (!callback) cur.customEvent("loginStatus", msg);
        else callback(msg);
    };
    socket.send(msg);
};
/**
 * Login callback.
 * @callback simpleCallback
 * @param {string} msg - Response message from server. Should be "ok" if success
 */

/**
 * Get room list in the server
 * @memberof GameConnector
 * @param {getRoomListCallback} [callback] - The callback that will be triggered after server's response arrival
 */

GameConnector.prototype.getRoomList = function(callback){
    var cur = this;
    var socket = this.socket;
    var msg = wrap("", 'getRoomList');
    if (!cur.connected) {
        throw "Not Login";
    }
    cur.waitting[msg.id] = function(msg){
        if (!callback) cur.customEvent("roomListStatus", msg);
        else callback(msg);
    };
    socket.send(msg);
};
/**
 * Login callback.
 * @callback getRoomListCallback
 * @param {Array} msg - Response message from server, containing a list of rooms.
 */

/**
 * Create a game room and join that room
 * @memberof GameConnector
 * @param {string} name - Name of the room to be created
 * @param {Object} mode - Mode of the room to be created
 * @param {simpleCallback} [callback] - The callback that will be triggered after server's response arrival
 */

GameConnector.prototype.createRoom = function(name, mode, callback){
    var cur = this;
    var socket = this.socket;
    var msg = wrap({name: name, mode: mode}, 'createRoom');
    if (!cur.connected) {
        throw "Not Login";
    }
    cur.waitting[msg.id] = function(msg){
        if (!callback) cur.customEvent("createRoomStatus", msg);
        else callback(msg);
    };
    socket.send(msg);
};

/**
 * Modify the mode of your current room. It is only valid when you are the creator of the room
 * @memberof GameConnector
 * @param {Object} mode - Mode of the room to be modified
 * @param {simpleCallback} [callback] - The callback that will be triggered after server's response arrival
 */
GameConnector.prototype.setRoom = function(mode, callback){
    var cur = this;
    var socket = this.socket;
    var msg = wrap({mode: mode}, 'setRoom');
    if (!cur.connected) {
        throw "Not Login";
    }
    socket.send(msg);
};

/**
 * Join a existing game room identified by roomName
 * @memberof GameConnector
 * @param {string} roomName - Name of the room to be joined
 * @param {simpleCallback} [callback] - The callback that will be triggered after server's response arrival
 */
GameConnector.prototype.joinRoom = function(roomName, callback){
    var cur = this;
    var socket = this.socket;
    var msg = wrap({roomName: roomName}, "joinRoom");
    if (!cur.connected) {
       throw "Not Login";
    }
    cur.waitting[msg.id] = function(msg){
        if (!callback) cur.customEvent("roomStatus", msg);
        else callback(msg);
    };
    socket.send(msg);
};

/**
 * Leave current game room
 * @memberof GameConnector
 * @param {simpleCallback} [callback] - The callback that will be triggered after server's response arrival
 */
GameConnector.prototype.leaveRoom = function(callback){
    var cur = this;
    var socket = this.socket;
    var msg = wrap("", "leaveRoom");
    if (!cur.connected) {
        cur.notLogin();
    }
    cur.waitting[msg.id] = function(msg){
        if (!callback) cur.customEvent("")
    };
    socket.send(msg);
};


/**
 * Join a existing game room identified by roomName
 * @memberof GameConnector
 * @param {number} px - Position X of the bullet
 * @param {number} py - Position Y of the bullet
 * @param {number} vx - Velocity X of the bullet
 * @param {number} vy - Velocity Y of the bullet
 * @param {simpleCallback} [callback] - The callback that will be triggered after server's response arrival
 */
GameConnector.prototype.emitBullet = function(px, py, vx, vy, callback){
    if (!cur.connected) {
        cur.notLogin();
    }
    var cur = this;
    var socket = this.socket;
    var msg = wrap({px:px, py:py, vx:vx, vy:vy}, "emitBullet");
    socket.send(msg);
};


GameConnector.prototype.notLogin = function(){
    throw "Not Login";
};
GameConnector.prototype.customEvent = function(type, msg){
    var myEvent = new CustomEvent(type, {detail:msg.con});
    window.dispatchEvent(myEvent);
};


