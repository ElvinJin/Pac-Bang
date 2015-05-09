var MyLogger = require('./tools/logger.js');
var users = require("./tools/db.js");
var logger = new MyLogger({level: 'debug'});
var wrapper = require("./tools/messageWrapper.js");
var wrap = wrapper.wrap;
var reWrap = wrapper.reWrap;


var socketService = function(io){
	io.on('connection', function(socket) {
		logger.log("Connected", socket);
		socket.on('message', function (msg) {
			var con = msg.con;
			var type = msg.type;
			var time = msg.t;
			var id = msg.id;
			var res = null;
			if (type != "hello" && !socket.attatchUser){
				socket.send(reWrap(msg, "Login First"));
			}
			switch (type) {
				case "hello":
					res = handleSession(socket, msg.con.username, msg.con.session);
					break;
			}
			if (res) socket.send(reWrap(msg, res));
		});
	});
};

var handleSession = function(socket, session, username){
	logger.log("Try to login", socket);
	var user = users.findOne({_id: username, session: session});
	if (user){
		socket.attatchUser = username;
		logger.log("Login Success", socket);
		return('ok');
	}
	logger.log("Login Fail", socket);
	return('User not found');
};

module.exports = socketService;