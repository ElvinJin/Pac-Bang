var MyLogger = require('./tools/logger.js');
var users = require("./tools/db.js");
var logger = new MyLogger({level: 'debug'});
var wrapper = require("./tools/messageWrapper.js");
var wrap = wrapper.wrap;

var Room = require("./game/room.js");
var roomList = {};
var userList = {};

var messageSend = require("./tools/messageSender.js");




var socketService = function(io){
	io.on('connection', function(socket) {
		logger.log("Connected", socket);
		socket.on('message', function (msg) {
			var con = msg.con;
			var type = msg.type;
			var time = msg.t;
			var id = msg.id;
			if ((type != "hello" && type != "iOSAttach") && !socket.attatchedUser){
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
					createRoom(socket, msg, io);
					break;
				case "setRoom":
					setRoom(io, socket, msg);
					break;
				case "joinRoom":
					joinRoom(io, socket, msg);
					break;
				case "leaveRoom":
					leaveRoom(io, socket, msg);
					break;
				case "emitBullet":
					emitBullet(io, socket, msg);
					break;
				case "bulletHit":
					bulletHit(io, socket, msg);
					break;
				case "ready":
					ready(io, socket, msg);
					break;
				case "triggerItem":
					triggerItem(io, socket, msg);
					break;
				case "updatePlayer":
					updatePlayer(io, socket, msg);
					break;
				case "declareReady":
					declareReady(io, socket, msg);
					break;
				case "iOSAttach":
					iOSAttach(io, socket, msg);
					break;
				case "iOSMove":
					iOSMove(io, socket, msg);
					break;
				case "iOSShoot":
					iOSShoot(io, socket, msg);
					break;
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
			if (socket.attatchedUser) {
				delete userList[socket.attatchedUser];
				delete socket.attatchedUser;
			}

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
			userList[user["_id"]] = socket;
			messageSend("ok", msg, socket, null, null);
		}
	});
};

var getRoomList = function(socket, msg){
	logger.log("Get room list", socket);
	var rv = [];
	for (var room in roomList){
		rv.push(roomList[room].getInf());
	}
	messageSend(rv, msg, socket, null, null);
};

var createRoom = function(socket, msg, io){
	var rv;
	logger.log("Create room", socket);
	var name = msg.con.name;
	var mode = msg.con.mode;

	if (roomList[name]){
		rv = "Duplicated name";
	}
	else{
		roomList[name] = new Room(msg.con.name, socket, msg.con.mode, io);
		rv = "ok";
		var l = [];
		for (var room in roomList){
			l.push(roomList[room].getInf());
		}
		messageSend(l, null, socket, io, 'all', "roomListStatus");
	}
	messageSend(rv, msg, socket, null, null);
};

var setRoom = function(io, socket, msg){
	var rv;
	logger.log("Set room", socket);
	var mode = msg.con.mode;

	if (!socket.attatchedRoom){
		logger.log("Set room failed", socket);
		rv = "Not in the room";
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
	logger.log("Join Room", socket);
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
	var l = [];
	for (var n in roomList){
		l.push(roomList[n].getInf());
	}
	messageSend(l, null, socket, io, 'all', "roomListStatus");
};

var leaveRoom = function(io, socket, msg){
	var rv;
	logger.log("Leave Room", socket);
	if (socket.attatchedRoom){
		rv = "ok";
		var roomName = socket.attatchedRoom;
		var room = roomList[roomName];
		room.leave(socket);
		if (room.empty()){
			delete roomList[room.name];
		}
		else{
			messageSend(room.getInf(), null, socket, io, roomName, "roomStatus", true);
		}
		var l = [];
		for (var n in roomList){
			l.push(roomList[n].getInf());
		}
		messageSend(l, null, socket, io, 'all', "roomListStatus");
	}
	if (!rv) rv = "You do not belong a room";
	messageSend(rv, msg, socket, null, null);
};

var declareReady = function(io, socket, msg){
	var rv;
	logger.log("Declare ready", socket);
	var roomName = socket.attatchedRoom;
	var room = roomList[roomName];
	var username = socket.attatchedUser;
	room.declareReady(username);
	messageSend(room.getInf(), null, socket, io, roomName, "roomStatus");
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
	var username = msg.con.username;
	var player = room.players[username];
	player.hit();
	if (room.members[username].attatchedIOS){
		room.members[username].attatchedIOS.emit("iOSHit");
	}
	var me = room.players[socket.attatchedUser];
	me.getCoin();
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
				player.getCoin();
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
				room.coinLeft -= 1;
				player.getCoin();
				console.log("Coin Left: " + room.coinLeft);
				if (room.coinLeft <= 0 && room.mode.mode == "classical"){
					room.endGame();
				}
			}
			break;
		case "bulletAdd":
			if (room.items.bulletAdd[id]){
				room.items.bulletAdd[id] = undefined;
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
	if (!roomName) return;
	var myName = socket.attatchedUser;
	var oppName;
	for (var user in roomList[socket.attatchedRoom].members){
		if (user != myName) oppName = user;
	}
	var player = room.players[myName];
	var oppPlayer = room.players[oppName];
	var rv = msg.con;
	rv.myHp = oppPlayer.hp;
	rv.oppHp = player.hp;
	rv.myScore = oppPlayer.score;
	rv.oppScore = player.score;
	rv.myBullet = oppPlayer.bullet;
	rv.oppBullet = player.bullet;
	messageSend(rv, null, socket, io, socket.attatchedRoom, "updateInformation", true);
};

var ready = function(io, socket, msg){
	logger.log("Ready", socket);
	var roomName = socket.attatchedRoom;
	var room = roomList[roomName];
	var username = socket.attatchedUser;
	room.ready(username);
};

//iPhone?????

var iOSAttach = function(io, socket, msg){
	var session = msg.con.session;
	var username = msg.con.username;
	var user = users.findOne({_id: username/*, session: session*/}, function(e, user) {
		if (e){
			socket.emit("iOSAttachFailed", e);
		}
		else if (!user){
			logger.log("Login Fail", socket);
			socket.emit("iOSAttachFailed", "Login Fail");
		}
		else{
			if (!userList[user["_id"]]) {
				logger.log("User not in the game", socket);
				socket.emit("iOSAttachFailed", "User not in the game");
			}
			else {
				logger.log("Login Success", socket);
				socket.attatchedUser = user["_id"];
				socket.attatchedSocket = userList[user["_id"]];
				userList[user["_id"]].attatchedIOS = socket;
				socket.emit("iOSAttachSucceeded");
				socket.emit("iOSHit", "SB");
			}
		}
	});
};


var iOSMove = function(io, socket, msg){
	logger.log("remoteMove", socket);
	console.log(msg);
	if (!socket.attatchedSocket) return;
	var clientSocket = socket.attatchedSocket;
	messageSend(msg.con, null, clientSocket, io, null, "remoteMove");
};

var iOSShoot = function(io, socket, msg){
	logger.log("remoteShoot", socket);
	console.log(msg);
	if (!socket.attatchedSocket) return;
	var clientSocket = socket.attatchedSocket;
	messageSend("", null, clientSocket, io, null, "remoteShoot");
};

module.exports = socketService;