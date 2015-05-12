var MyLogger = require('./tools/logger.js');
var users = require("./tools/db.js");
var logger = new MyLogger({level: 'debug'});
var wrapper = require("./tools/messageWrapper.js");
var wrap = wrapper.wrap;
var reWrap = wrapper.reWrap;

var Room = require("./game/room.js");
var roomList = {};

var messageSend = require("./tools/messageSender.js");


var socketService = function(io){
	io.on('connection', function(socket) {
		logger.log("Connected", socket);
		socket.on('message', function (msg) {
			var con = msg.con;
			var type = msg.type;
			var time = msg.t;
			var id = msg.id;
			if (type != "hello" && !socket.attatchedUser){
				messageSend("loginFirst", msg, socket, null, null);
			}
			switch (type) {
				case "hello":
					handleSession(socket, msg);
					break;
				case "getRoomList":
					getRoomList(socket, msg);
					break;
				case "createRoom":
					createRoom(socket, msg);
					break;
				case "setRoom":
					setRoom(io, socket, msg);
					break;
				case "joinRoom":
					joinRoom(io, socket, msg);
					break;
				case "leaveRoom":
					break;
				case "emitBullet":
					emitBullet(io, socket, msg);
					break;
				case "bulletHit":
					bulletHit(io, socket, msg);
					break;
				case "triggerItem":
					triggerItem(io, socket, msg);
					break;
				case "updatePlayer":
					updatePlayer(io, socket, msg);
					break;
				case "declareReady":
					declareReady(io, socket, msg);
			}
		});

		socket.on('disconnect', function () {
			logger.log("User leave", socket);
			if (socket.attatchedRoom){
				var room = roomList[socket.attatchedRoom];
				room.leave(socket);
				if (room.empty()){
					delete roomList[room.name];
				}
			}
			if (socket.attatchedUser) delete socket.attatchedUser;
		});

		socket.on('error', function (err) {
			console.error(err);
		});
	});
};

var handleSession = function(socket, msg){
	logger.log("Try to login", socket);
	var user = users.findOne({_id: msg.con.username, session: msg.con.session}, function(e, user){
		if (e){
			messageSend(e, msg, socket, null, null);
		}
		else if (!user){
			logger.log("Login Fail", socket);
			messageSend("Login First", msg, socket, null, null);
		}
		else{
			logger.log("Login Success", socket);
			socket.attatchedUser = user["_id"];
			messageSend("ok", msg, socket, null, null);
		}
	});
};

var getRoomList = function(socket, msg){
	logger.log("Get room list", socket);
	var rv = [];
	for (var room in roomList){
		rv.push(room);
	}
	messageSend(rv, msg, socket, null, null);
};

var createRoom = function(socket, msg){
	var rv;
	logger.log("Create room", socket);
	var name = msg.con.name;
	var mode = msg.con.mode;

	if (roomList[name]){
		rv = "Duplicated name";
	}
	else{
		roomList[name] = new Room(msg.con.name, socket, msg.con.mode);
		rv = "ok";
	}
	messageSend(rv, msg, socket, null, null);
};

var setRoom = function(io, socket, msg){
	var rv;
	logger.log("Set room", socket);
	var mode = msg.con.mode;

	if (!socket.attatchedRoom || roomList[socket.attatchedRoom].creator != socket.attatchedUser){
		logger.log("Set room failed", socket);
		rv = "Permission denied";
	}
	else{
		var room = roomList[socket.attatchedRoom];
		room.setMode(msg.con.mode);
		rv = room.getInf();
		messageSend(rv, null, socket, io, room.name, "roomStatus");
	}
};

var joinRoom = function(io, socket, msg){
	var rv;
	logger.log("Join room", socket);
	var roomName = msg.con.roomName;
	if (!roomList[roomName]){
		logger.log("Join room failed", socket);
		rv = "Room not exists";
	}
	else{
		var room = roomList[roomName];
		var err = room.join(socket);
		if (!err) {
			messageSend(room.getInf(), null, socket, io, room.name, "roomStatus");
			rv = 'ok';
		}
		else rv = err;
	}
	messageSend(rv, msg, socket, null, null);
};

var declareReady = function(io, socket, msg){
	var rv;
	logger.log("Declare ready", socket);
	var roomName = socket.attatchedRoom;
	var room = roomList[roomName];
	var username = socket.attatchedUser;
	room.status.members[username] = "Ready";
};

//Game Control

var emitBullet = function(io, socket, msg){
	var rv;
	logger.log("Emit bullet", socket);
	var roomName = socket.attatchedRoom;
	var room = roomList[roomName];
	var player = room.players[socket.attatchedUser];
	player.emit();
	messageSend(msg.con, null, socket, io, roomName, "counterPartyEmit", true);
};

var bulletHit = function(io, socket, msg){
	var rv;
	logger.log("Bullet hit", socket);
	var roomName = socket.attatchedRoom;
	var room = roomList[roomName];
	var username = msg.con;
	var player = room.players[username];
	player.hit();
};

var triggerItem = function(io, socket, msg){
	var rv;
	logger.log("Trigger item", socket);
	var roomName = socket.attatchedRoom;
	var room = roomList[roomName];
	var username = socket.attatchedUser;
	var player = room.players[username];
	var type = msg.con.itemType;
	var id = msg.con.itemId;
	switch (type){
		case "enemyDestroy":
			if (room.items.enemy[id]){
				room.items.enemy[id] = undefined;
				messageSend(id, null, null, io, roomName, "enemyDestroy", true);
			}
			break;
		case "enemyEncounter":
			if (room.items.enemy[id]){
				player.meetEnemy();
			}
			break;
		case "coin":
			if (room.items.coin[id]){
				room.items.coin[id] = undefined;
				player.getCoin();
			}
			break;
		case "bulletAdd":
			if (room.items.bullet[id]){
				room.items.bullet[id] = undefined;
				player.getBullet();
			}
			break;
		case "blood":
			if (room.items.blood[id]){
				room.items.blood[id] = undefined;
				player.getHp();
			}
			break;
		case "speedUp":
			if (room.items.speedUp[id]){
				room.items.blood[id] = undefined;
				messageSend("", null, socket, null, null, "speedUp");
			}
			break;
	}
};

var updatePlayer = function(io, socket, msg){
	var roomName = socket.attatchedRoom;
	var room = roomList[roomName];
	var username = socket.attatchedUser;
	var player = room.players[username];
	var rv = msg.con;
	rv.name = username;
	rv.hp = player.hp;
	rv.bullet = player.bullet;
	rv.score = player.score;
	messageSend(rv, null, socket, io, socket.attatchedRoom, "updateInformation");
};

var ready = function(io, socket, msg){
	var roomName = socket.attatchedRoom;
	var room = roomList[roomName];
	var username = socket.attatchedUser;
	room.ready(username);
};



module.exports = socketService;