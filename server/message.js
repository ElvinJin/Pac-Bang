var MyLogger = require('./tools/logger.js');
var users = require("./tools/db.js");
var logger = new MyLogger({level: 'debug'});
var wrapper = require("./tools/messageWrapper.js");
var wrap = wrapper.wrap;
var reWrap = wrapper.reWrap;

var Room = require("./game/room.js");
var roomList = {};

var messageSend = function(res, ori, socket, io, to){
	var msg = null;
	if (res === null || res === undefined) return;
	if (!ori) msg = wrap(res, "serverOrigin");
	else msg = reWrap(ori, res);
	if (!to){
		socket.send(msg);
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
			messageSend("ok", msg, socket, null, null);
		}
	});
};

var getRoomList = function(socket, msg){
	var rv = [];
	for (var room in roomList){
		rv.push(room);
	}
	messageSend(rv, msg, socket, null, null);
};

module.exports = socketService;