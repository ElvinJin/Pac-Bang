/**
 * Created by tanghaomo on 15/5/12.
 */
var wrap = require("./messageWrapper").wrap;
var reWrap = require("./messageWrapper").reWrap;

var messageSend = function(res, ori, socket, io, to, type, exclu){
    var msg = null;
    if (res === null || res === undefined) return;
    if (!ori) msg = wrap(res, type);
    else msg = reWrap(ori, res);
    if (!to){
        socket.send(msg);
    }
    else{
        if (exclu){
            io.broadcast.to(to).send(msg);
        }
        else {
            io.sockets.in(to).send(msg);
        }
    }
};


module.exports = messageSend;