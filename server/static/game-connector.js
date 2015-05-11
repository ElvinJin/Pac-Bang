/**
 * Created by tanghaomo on 15/5/10.
 */
var wrap = wrapper.wrap;
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
};

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

GameConnector.prototype.setRoom = function(mode, callback){
    var cur = this;
    var socket = this.socket;
    var msg = wrap({mode: mode}, 'setRoom');
    if (!cur.connected) {
        throw "Not Login";
    }
    socket.send(msg);
};

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

GameConnector.prototype.customEvent = function(type, msg){
    var myEvent = new CustomEvent(type, {detail:msg.con});
    window.dispatchEvent(myEvent);
};

