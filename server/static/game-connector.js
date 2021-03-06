var wrap = wrapper.wrap;

/**
 * Creates a game connector instance.
 * @class GameConnector
 */


/**
 * The update information.
 * @typedef {Object} UpdateInf
 * @property {number} myHp - HP of the player
 * @property {number} oppHp - HP of your opponent player
 * @property {number} myScore - Score of yours
 * @property {number} oppScore - Score of your opponent player
 * @property {number} myBullet - Number of your bullet
 * @property {number} oppBullet - Number of your opponent player's bullet.
 * @property {number} px - Position X
 * @property {number} py - Position Y
 * @property {String} dir - {"Up", "Down", "Left", "Right"}
 */
/**
 * The status of a user.
 * @typedef {Object} UserInf
 * @property {string} name - Name of the user
 * @property {number} hp - HP of the player
 * @property {number} score - Score of the player
 * @property {number} bullet - Number of bullet of the player.
 * @property {number} px - Position X
 * @property {number} py - Position Y
 * @property {number} dir - {0: Up, 1: Down, 2: Left, 3: Right}
 */
/**
 * The status of a user's movement.
 * @typedef {Object} UserMove
 * @property {number} px - Position X
 * @property {number} py - Position Y
 * @property {number} direction - {0: Up, 1: Down, 2: Left, 3: Right}
 */
/**
 * @typedef {Object} BulletStatus
 * @property {number} px - Position X
 * @property {number} py - Position Y
 * @property {number} vx - Velocity X
 * @property {number} vy - Velocity Y
 *
 */
/**
 * @typedef {Object} ItemStatus
 * @property {number} px - Position X
 * @property {number} py - Position Y
 * @property {String} type - type of the item {"coin", "speedUp", "enemy", "blood", "bulletAdd"}
 * @property {number} id - Id of the item
 *
 */

/**
 * @typedef {Object} iOSAttach message
 * @property {loginInf} con - message content
 * @property {String} [id] - the message id
 * @property {String} type - "iOSAttach"
 * @property {number} t - unix timestamp when the message is created
 *
 */
/**
 * @typedef {Object} iOSOperation message
 * @property {loginInf} con - message content
 * @property {String} [id] - the message id
 * @property {String} type - "iOSOp"
 * @property {number} t - unix timestamp when the message is created
 *
 */

/**
 * @typedef {Object}
 * @property {String} buttonType - {"up", "down", "left", "right", "stop", "bullet"}
 *
 */

/**
 * @typedef {Object} loginInf
 * @property {String} username
 * @property {String} session
 *
 */
var GameConnector = function(url){
    var cur = this;
    cur.socket = url ? io(url) : io();
    cur.connected = false;
    cur.session = null;
    cur.uesrname = null;
    cur.waitting = {};
    cur.socket.on('message', function(msg){
        if (msg.type != 'updateInformation') {
            console.log(msg);
        }
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
     * @type {Object}
     * @property {UserInf[]} detail - An array of users' final status
     */
    /**
     * The event indicate that a bullet is emitted by other user.
     *
     * @event counterPartyEmit
     * @type {Object}
     * @property {BulletStatus} detail - A object that describe the emitted bullet
     */
    /**
     * The event indicate that a user is hit by a bullet.
     *
     * @event playerDied
     * @type {Object}
     * @property {String} detail - The name of died user
     */
    /**
     * The event indicate that a enemy is destroyed.
     *
     * @event enemyDestroy
     * @type {Object}
     * @property {number} detail - ID of the enemy
     */
    /**
     * The event indicate that a you get a speed up.
     *
     * @event speedUp
     */
    /**
     * The event indicate that a new item should be generated.
     *
     * @event generateItem
     * @type {Object}
     * @property {ItemStatus} detail - Information about the new item.
     */
    /**
     * The event indicate that a user information should be updated.
     *
     * @event updatePlayer
     * @type {Object}
     * @property {UpdateInf} detail  * @param {string} username - Unique username
     - Information about the new item.
     */
    /**
     * The event indicate that all the users are ready and the client should start loading resources.
     *
     * @event startLoading
     */
    /**
     * The event indicate that a remote iOS device is making a operation on the player
     *
     * @event iOSOp
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
        if (!callback) cur.customEvent("leaveRoom", msg);
        else callback(msg);
    };
    socket.send(msg);
};

/**
 * Declare player is ready to play. If all the users have declared, the game will start.
 * @memberof GameConnector
 */
GameConnector.prototype.declareReady = function(){
    var cur = this;
    if (!cur.connected) {
        cur.notLogin();
    }
    var socket = this.socket;
    var msg = wrap("", "declareReady");
    socket.send(msg);
};


/**
 * Emit a bullet
 * @memberof GameConnector
 * @param {number} px - Position X of the bullet
 * @param {number} py - Position Y of the bullet
 * @param {number} vx - Velocity X of the bullet
 * @param {number} vy - Velocity Y of the bullet
 * @param {simpleCallback} [callback] - The callback that will be triggered after server's response arrival
 */
GameConnector.prototype.emitBullet = function(obj, callback){
    var cur = this;
    if (!cur.connected) {
        cur.notLogin();
    }
    var socket = this.socket;
    var msg = wrap(obj, "emitBullet");
    socket.send(msg);
};


/**
 * An user is hit by your bullet
 * @memberof GameConnector
 * @param {String} username - name of the user hit
 */
GameConnector.prototype.bulletHit = function(username){
    var cur = this;
    if (!cur.connected) {
        cur.notLogin();
    }
    var socket = this.socket;
    var msg = wrap(username, "bulletHit");
    socket.send(msg);
};

/**
 * Interaction with a item
 * @memberof GameConnector
 * @param {String} itemType - {enemyDestroy, enemyEncounter, coin, blood, speedUp, bulletAdd}
 * @param {String} itemId - Id of the item
 */

GameConnector.prototype.triggerItem = function(obj){
    var cur = this;
    if (!cur.connected) {
        cur.notLogin();
    }
    var socket = this.socket;
    var msg = wrap(obj, "triggerItem");
    socket.send(msg);
};

/**
 * Upload your position
 * @memberof GameConnector
 * @param {UserMove} playerStatus - A object that contains all the information of current user
 */
GameConnector.prototype.updatePlayer = function(playerStatus){
    var cur = this;
    if (!cur.connected) {
        cur.notLogin();
    }
    var socket = this.socket;
    var msg = wrap(playerStatus, "updatePlayer");
    socket.send(msg);
};

/**
 * Tell server that client is ready.
 * @memberof GameConnector
 */
GameConnector.prototype.ready = function(){
    var cur = this;
    if (!cur.connected) {
        cur.notLogin();
    }
    var socket = this.socket;
    var msg = wrap("", "ready");
    socket.send(msg);
};


GameConnector.prototype.notLogin = function(){
    throw "Not Login";
};
GameConnector.prototype.customEvent = function(type, msg){
    var myEvent = new CustomEvent(type, {detail:msg.con});
    window.dispatchEvent(myEvent);
};