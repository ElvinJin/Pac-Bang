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

    creatorSocket.join(name);
    creatorSocket.attatchedRoom = name;
};

Room.prototype.empty = function(){
    return Boolean(Object.keys(this.members).length <= 0);
};

Room.prototype.getMembers = function(){
    var rv =[];
    for (var user in this.members){
        rv.push(user);
    }
    return rv;
};

Room.prototype.getInf = function(){
    var rv = {};
    rv.members = this.getMembers();
    rv.mode = this.mode;
    rv.name = this.name;
    return rv;
};

Room.prototype.join = function(userSocket){
    var cur = this;
    cur.members[userSocket.attatchedUser] = "member";
    userSocket.join(cur.name);
    userSocket.attatchedRoom = cur.name;
};

Room.prototype.leave = function(userSocket){
    var cur = this;
    userSocket.leave(cur.name);
    delete userSocket.attatchedRoom;
    var socket = cur.members[userSocket.attatchedUser];
    if (socket){
        if (socket.attatchedUser == cur.creator){
            cur.creator = null;
        }
        delete cur.members[userSocket.attatchedUser];
        if (Object.keys(cur.members).length <= 0) cur.destroy();
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

Room.prototype.setMode = function(mode){
    this.mode = mode;
};

Room.prototype.destroy = function(){

};

module.exports = Room;