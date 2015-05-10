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

GameConnector.prototype.login = function(username, session){
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
        cur.customEvent("loginStatus", msg);
    };
    socket.send(msg);
};

GameConnector.prototype.getRoomList = function(){
    var cur = this;
    var socket = this.socket;
    var msg = wrap("", 'getRoomList');
    if (!cur.connected) {
        callback("Login First");
        return;
    }
    cur.waitting[msg.id] = function(msg){
        cur.customEvent("roomListStatus", msg);
    };
    socket.send(msg);
};

GameConnector.prototype.customEvent = function(type, msg){
    var myEvent = new CustomEvent(type, {detail:msg.con});
    window.dispatchEvent(myEvent);
};
