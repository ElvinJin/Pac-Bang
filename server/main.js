var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var pageService = require('./page.js');
var socketService = require('./message.js');

pageService(app);
socketService(io);

var port = 3000;

http.listen(port, function(){
	console.log("listen on " + port);
});
