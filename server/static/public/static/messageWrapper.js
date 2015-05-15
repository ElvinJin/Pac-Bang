/**
 * Created by tanghaomo on 15/5/9.
 */
var d = new Date();
var makeId = function()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

var wrapper = {};

wrapper.wrap = function(msg, type){

    var t = d.getTime();
    var id = makeId();
    return {type: type, con: msg, id: id, t: t};
};

wrapper.reWrap = function(ori, msg){
    ori.con = msg;
    return ori;
};
