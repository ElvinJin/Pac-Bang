/**
 * Created by tanghaomo on 15/5/8.
 */


var Logger = function(opt){
    this.levle = opt.level? opt.level:"debug";
};

Logger.prototype.log = function(msg, socket){
    if (this.level == "debug") return;
    console.log('[' + socket.id + ']' + ' ' + msg);
};

module.exports = Logger;