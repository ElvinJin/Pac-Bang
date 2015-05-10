var MyLogger = require('./tools/logger.js');
var users = require("./tools/db.js");
var logger = new MyLogger({level: 'debug'});
var wrapper = require("./tools/messageWrapper.js");
var wrap = wrapper.wrap;
var reWrap = wrapper.reWrap;

var Room = require("./game/room.js");
var roomList = {};

var messageSend = function(res, ori, socket, io, to, type){
	var msg = null;
	if (res === null || res === undefined) return;
	if (!ori) msg = wrap(res, type);
	else msg = reWrap(ori, res);
	if (!to){
		socket.send(msg);
	}
	else{
		io.sockets.in(to).send(msg);
	}
};


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
	logger.log("Set room", socket);
	var mode = msg.con.mode;

	if (!socket.attatchedRoom || roomList[socket.attatchedRoom].creator != socket.attatchedUser){
		logger.log("Set room failed", socket);
		rv = "Permission denied";
	}
	else{
		var rv;
		var room = roomList[socket.attatchedRoom];
		room.setMode(msg.con.mode);
		rv = room.mode;
		messageSend(rv, null, socket, io, room.name, "modeChange");
	}
};

module.exports = socketService;