/**
 * Created by tanghaomo on 15/5/10.
 */
var Room = function(name, creatorSocket, mode){
    var cur = this;
    cur.creator = creatorSocket.attatchedUser;
    cur.mode = mode;
    cur.members = {};
    cur.members[creatorSocket.attatchedUser] = creatorSocket;
    cur.name = name;
};

Room.prototype.join = function(userSocket){
    cur = this;
    cur.members[userSocket.attatchedUser] = "member";
};

Room.prototype.leave = function(userSocket){
    var cur = this;
    var socket = cur.members[userSocket.attatchedUser];
    if (socket){
        if (socket.attatchedUser == cur.creator){
            cur.creator = null;
        }
        delete cur.members[userSocket.attatchedUser];
        if (cur.members.length <= 0) cur.destroy();
        else if (!cur.creator){
            for (var member in cur.members){
                cur.creator = cur.members[member].attatchedUser;
                break;
            }
        }
        return true;
    }
    return false;
};

Room.prototype.destroy = function(){

};

module.exports = Room;