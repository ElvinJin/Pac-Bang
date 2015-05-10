/**
 * Created by tanghaomo on 15/5/8.
 */


var Logger = function(opt){
    this.levle = opt.level? opt.level:"debug";
};

Logger.prototype.log = function(msg, socket){
    var label = socket.attatchedUser? socket.attatchedUser : socket.id;
    if (this.level == "debug") return;
    console.log('[' + label + ']' + ' ' + msg);
};

module.exports = Logger;