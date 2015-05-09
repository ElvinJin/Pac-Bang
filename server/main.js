var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var pageService = require('./page.js');
var socketService = require('./message.js');

pageService(app);
socketService(io);


http.listen(3000, function(){
	console.log("listen on 3000");
});