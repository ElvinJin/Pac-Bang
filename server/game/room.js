/**
 * Created by tanghaomo on 15/5/10.
 */
var messageSend = require("../tools/messageSender.js");
var mapInfo = require("./map.js");

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
    this.hp = 100;
    messageSend("", null, this.room.members[this.playerName], null, null, "playerDied");
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
    cur.size = 2;
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
    var members = this.getMembers();
    rv.player1 = members[0];
    rv.player2 = members[1] ? members[1] : "";
    rv.mode = this.mode.mode;
    rv.number = rv.player2 ? 2 : 1;
    rv.status1 = this.status.members[rv.player1];
    rv.status2 = this.status.members[rv.player2] ? this.status.members[rv.player2] : "";
    rv.map = this.mode.map;
    rv.roomname = this.name;
    return rv;
};

Room.prototype.join = function(userSocket){
    var cur = this;
    if(cur.status.server == "Ready") return "The game is running";
    if (Object.keys(cur.members).length >= cur.size) return "The room is full";
    cur.members[userSocket.attatchedUser] = userSocket;
    cur.status.members[userSocket.attatchedUser] = "Not Ready";
    userSocket.join(cur.name);
    userSocket.attatchedRoom = cur.name;
    return null;
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

Room.prototype.declareReady = function(userName){
    this.status.members[userName] = "Ready";
    var allReady = true;
    for (var member in this.status.members){
        if (this.status.members[member] != "Ready") allReady = false;
    }
    if (allReady && Object.keys(this.members).length == 2){
        for (var member in this.status.members){
            this.status.members[member] = "Loading";
        }
        messageSend("", null, null, this.io, this.name, "startLoading");
        this.loading();
    }
};

Room.prototype.ready = function(userName){
    if (this.status.members[userName] == "Loading"){
        this.status.members[userName] = "Playing";
        var allReady = true;
        for (var member in this.status.members){
            if (this.status.members[member] != "Playing") allReady = false;
        }
        if (allReady && this.status.client == "Not Ready" && this.status.server == "Ready"){
            this.status.client = "Ready";
            this.startGame();
        }
    }
};


Room.prototype.startGame = function(){
    messageSend("", null, null, this.io, this.name, "gameStart");
    var cur = this;
    var mapId = this.mode.map.slice(-1);
    mapId = parseInt(mapId);
    var coinLength = mapInfo[mapId].length;
    for (var i = 0; i < 50; i++){
        var px = mapInfo[mapId][parseInt(Math.random() * coinLength)].x;
        var py = mapInfo[mapId][parseInt(Math.random() * coinLength)].y;
        this.generateItem("coin", px, py);
    }
    this.coinLeft = 50;
    for (i = 0; i < 10; i++){
        px = mapInfo[mapId][parseInt(Math.random() * coinLength)].x;
        py = mapInfo[mapId][parseInt(Math.random() * coinLength)].y;
        this.generateItem("enemy", px, py);
    }
    if (this.mode.mode == "timing") {
        this.timmer = setInterval(function () {
            cur.endGame();
        }, 10000);
    }
    this.randomItemStart(10);
};

Room.prototype.randomItemStart = function(prob){
    var cur = this;
    cur.generator = setInterval(function(){
        var mapId = cur.mode.map.slice(-1);
        mapId = parseInt(mapId);
        var coinLength = mapInfo[mapId].length;
        var px = mapInfo[mapId][parseInt(Math.random() * coinLength)].x;
        var py = mapInfo[mapId][parseInt(Math.random() * coinLength)].y;
        var p = Math.random() * prob;
        if (p < 1){
            cur.generateItem("blood", px, py);
        }
        else if (p < 2){
            cur.generateItem("speedUp", px, py);
        }
        else if (p < 4){
            cur.generateItem("bulletAdd", px, py);
        }
        else if (p < 5 && cur.mode.mode == "timing"){
            cur.generateItem("coin", px, py);

        }
    }, 1000);
};

Room.prototype.randomItemStop = function(){
     clearInterval(this.generator);
};

Room.prototype.loading = function(){
    this.items.coin = [];
    this.items.blood = [];
    this.items.speedUp = [];
    this.items.enemy = [];
    this.items.bulletAdd = [];
    this.items.coinLeft = 0;
    for (var member in this.members){
        this.players[member] = new PlayerStatus(member, this);
    }
    this.status.server = "Ready";
};

Room.prototype.endGame = function(){
    clearInterval(this.timmer);
    var rv = [];
    this.randomItemStop();
    for (var player in this.players){
        rv.push(this.players[player].getStatus());
    }
    //Update player's inf
    var users = require("../tools/db.js");
    var winner = rv[0].score > rv[1].score ? rv[0].name : rv[1].name;
    var loser = rv[0].score <= rv[1].score ? rv[0].name : rv[1].name;
    users.findOne({"_id":winner}, function(e, user){
        user.exp += 10;
        user.total += 1;
        user.win += 1;
        users.update({"_id":winner}, user);
    });
    users.findOne({"_id":loser}, function(e, user){
        user.exp -= 5;
        user.total += 1;
        users.update({"_id":loser}, user);
    });
    messageSend(rv, null, null, this.io, this.name, "gameEnd");
    for (var member in this.status.members){
        this.status.members[member] = "Not Ready";
    }
    for (member in this.members){
        delete this.members[member].attatchedRoom;
    }
};

Room.prototype.generateItem = function(type, posX, posY){
    var id = this.items[type].length;
    this.items[type][id] = true;
    messageSend({type:type, px:parseInt(posY), py:parseInt(posX), id:id}, null, null, this.io, this.name, "generateItem");
};


module.exports = Room;