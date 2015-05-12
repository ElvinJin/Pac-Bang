/**
 * Created by tanghaomo on 15/5/10.
 */
var messageSend = require("../tools/messageSender.js");

var PlayerStatus = function(playerName, room){
    this.playerName = playerName;
    this.score = 0;
    this.hp = 100;
    this.bullet = 3;
    this.room = room;
};

PlayerStatus.prototype.getCoin = function(){
    this.score += 10;
};

PlayerStatus.prototype.getHp = function(){
    this.hp = this.hp + 10 >= 150 ? 150: this.hp + 10;
};

PlayerStatus.prototype.getBullet = function(){
    this.bullet = this.bullet + 1 >= 10 ? 10 : this.bullet + 1;
};

PlayerStatus.prototype.meetEnemy = function(){
    this.hp = this.hp - 50 <= 0 ? 0 : this.hp - 50;
    if (this.hp == 0) this.died();
};

PlayerStatus.prototype.hit = function(){
    this.hp = this.hp - 30 <= 0 ? 0 : this.hp - 30;
    if (this.hp == 0) this.died();
};

PlayerStatus.prototype.emit = function(){
    this.bullet = this.bullet - 1 <= 0 ? 0 : this.bullet - 1;
};

PlayerStatus.prototype.died = function(){
    messageSend(this.playerName, null, null, this.io, this.room.name, "playerDied");
};

PlayerStatus.prototype.getStatus = function(){
    return {hp: this.hp, score: this.score, bullet: this.bullet, name:this.playerName};
};





var Room = function(name, creatorSocket, mode, io){
    var cur = this;
    cur.io = io;
    cur.creator = creatorSocket.attatchedUser;
    cur.mode = mode;
    cur.members = {};
    cur.members[creatorSocket.attatchedUser] = creatorSocket;
    cur.name = name;
    cur.status = {};
    cur.status.client = "Not Ready";
    cur.status.server = "Not Ready";
    cur.status.members = {};
    cur.status.members[creatorSocket.attatchedUser] = "Not Ready";

    //Initialize Items
    cur.items = {};
    cur.players = {};

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
    cur.status.members[userSocket.attatchedUser] = "Not Ready";
    userSocket.join(cur.name);
    userSocket.attatchedRoom = cur.name;
};

Room.prototype.leave = function(userSocket){
    var cur = this;
    userSocket.leave(cur.name);
    delete userSocket.attatchedRoom;
    var socket = cur.status.members[userSocket.attatchedUser];
    delete cur.status[userSocket.attatchedUser];
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

Room.prototype.ready = function(userName){
    if (this.status.members[userName] == "Loading"){
        this.status.members[userName] = "Ready";
        var allReady = true;
        for (var member in this.status.members){
            if (this.status.members[member] != "Ready") allReady = false;
        }
        if (allReady && this.status.client == "Not Ready" && this.server == "Ready"){
            this.status.client = "Ready";
            this.startGame();
        }
    }
};

Room.prototype.startGame = function(){
    //TODO load map inf
    this.items.coin = [];
    this.items.blood = [];
    this.items.speedUp = [];
    this.items.enemy = [];
    for (var member in this.members){
        this.players[member] = new PlayerStatus(member, this);
    }
    messageSend("", null, null, this.io, this.name, "gameStart");
};

Room.prototype.endGame = function(){
    var rv = [];
    for (var player in this.players){
        rv.push(this.players[player].getStatus());
    }
    messageSend(rv, null, null, this.io, this.name, "gameEnd");
    for (var member in this.status.members){
        this.status.members[member] = "Not Ready";
    }
    this.status.client = "Not Ready";
    this.status.server = "Not Ready";
};

Room.prototype.generateItem = function(type){
    var id = this.items[type].length;
    this.items[type][id] = true;
    //TODO determine the position of the item
    //Randomly generate now
    var posX = Math.random() * 1600;
    var posY = Math.random() * 640;
    messageSend({type:type, px:posX, py:posY, id:id}, null, null, this.io, this.name, "generateItem");
};


module.exports = Room;