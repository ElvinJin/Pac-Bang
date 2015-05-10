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
        }
    });
};

GameConnector.prototype.login = function(username, session, callback){
    var cur = this;
    var socket = this.socket;
    var msg = wrap({username:username, session: session}, 'hello');
    cur.waitting[msg.id] = function(msg){
        if (msg.con == 'ok'){
            cur.connected = true;
            cur.username = username;
            cur.session = session;
        }
        if (callback) callback(msg.con);
    };
    socket.send(msg);
};

GameConnector.prototype.getRoomList = function(callback){
    var cur = this;
    var socket = this.socket;
    var msg = wrap("", 'getRoomList');
    if (!cur.connected) {
        callback("Login First");
        return;
    }
    cur.waitting[msg.id] = callback;
    socket.send(msg);
};

