/**
 * Created by tanghaomo on 15/5/9.
 */
var makeId = require('./rid.js');
var d = new Date();

var rv = {};

rv.wrap = function(msg, type){
    var t = d.getTime();
    var id = makeId();
    return {type: type, con: msg, id: id, t: t};
};

rv.reWrap = function(ori, msg){
    ori.con = msg;
    return ori;
};

module.exports = rv;