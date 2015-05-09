var logger = require('./tools/logger.js')({level: 'debug'});
var users = require("./tools/db.js");
var socketService = function(io){
	io.on('connection', function(socket){
		logger.log("Connected", socket);
		socket.on('hello', function(msg){
			logger.log("Try to log in", socket);
			if (msg.username && msg.sessionId){
				var user = users.findOne({_id: msg.username, session: msg.sessionId});
				if (user) {
					socket.attachUser = msg.username;
				}
			}
			if (socket.attachUser){
				socket.emit('ok');
			}
			else{
				socket.emit('err', 'Login first');
			}
		});
	})
};

module.exports = socketService;