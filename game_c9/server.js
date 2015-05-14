var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

//app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res){

	res.sendFile(__dirname  + '/views/index.html');
	// serve static assets
	app.use( express.static( __dirname + '/public' ) );


});




var port =   process.env.PORT;
var host = process.env.IP;
var server = require('http').createServer(app);
// listen to port number 4140
server.listen( port, host, function(){
	//var host = server.address().address;
	//var port = server.address().port;
	console.log('Listening at http://%s:%s', host, port);
})


// server should wait for both side are connected and ready

// client unique ID
var clientIDList = [];
var numberOfClients = 0;

// var to store ready status
var user1Ready = false;
var user2Ready = false;
var coinGenerator;
var bloodGenerator;
var bulletAddGenerator;
var coinList = [];
var bloodList = [];
var bulletAddList = [];

// game width
var gameWidth = 1200;
var gameHeight = 630;


// can only call 


var io = require( 'socket.io' )( server );

io.on( 'connection', function( socket ) {
	
	numberOfClients += 1;
	if(numberOfClients > 2){
		console.log('already 2 user, disconnect');
		io.emit('quit',{clientID:socket.id});
	}
	
	// add to list
	
	// server tell clinet game start
	socket.on('ready',function(data) {
		console.log(data);
	    	io.emit('gameStart',{gameMinute:1,gameSecond:22});
	    
	    	
	    	
	    	
	})

	
	console.log('client connect with id : ' + socket.id);
	clientIDList.push(socket.id);
	console.log('clientID list : ' + clientIDList);
	
	socket.on( 'disconnect', function() {
		
		numberOfClients -= 1;
		console.log('user disconnect');
		
		// update client list
		 clientIDList = removeA(clientIDList, socket.id);
		console.log('clientID list : ' + clientIDList);
		
		if(numberOfClients == 0){
			console.log('no client now, clear repeat function');
			clearInterval(coinGenerator);
			clearInterval(bloodGenerator);
		}
		
	});
	
	socket.on('hi',function(data){
		io.emit('register',socket.id);
		// record socket.id
		
		
	});
	
	socket.on('updatePlayer',function(data) {
	    //console.log(data);
	    var temp = {counterPartyName:'hisName',positionX:data['positionX']+20,positionY:data['positionY']+20,direction:data['direction'],
	    	myScore:1000,myHP:101,hisScore:1200,hisHP:102,myBulletNum:3
	    };
	   	
		   io.emit('updateInformation',temp);
	    
	    
	})
	
	
	// need to wait for 2 player all ready
	socket.on('canGenerate',function(data) {
		console.log('start generate');
	    io.emit('generateItem',{itemType:'coin',positionX:100,positionY:100,itemID:1});
	    
	    io.emit('generateItem',{itemType:'blood',positionX:130,positionY:100,itemID:1});
	    
	    io.emit('generateItem',{itemType:'speedUp',positionX:150,positionY:100,itemID:1});
	    
	    io.emit('generateItem',{itemType:'bulletAdd',positionX:170,positionY:100,itemID:1});
	})
	
	
	socket.on('triggerItem',function(data) {
	    console.log(data);
	    
	    //io.emit('playerDied',true);
	})
	
	socket.on('emitBullet',function(data){
		console.log(data);
		
		var x = data['positionX'] + 20;
        var y = data['positionY'] + 20;
        var vX = data['velocityX'];
        var vY = data['velocityY'];
        
        // emit back, test
        io.emit('counterPartyEmit',{positionX:x,positionY:y,velocityX:vX,velocityY:vY})
	})
	
	
	socket.on('bulletHit',function(data){
		
		console.log(data);
	})
	
	// =================
	// should rsponse only when both has send confirm and has two client connected
	socket.on('generateCoin',function(data) {
	    
	    // send information repeatedly
	    //console.log('generate coin for client');
	    
	    
	    // repeat function after all client in room say OK
	    // how to stop?
	    // send to specific room 
	    if(numberOfClients == 2){
		    var x = 20;
		    var y = 20;
		    var coinID = 0;
		    coinGenerator = setInterval(function(){
		    	x += 30;
		    	y += 30;
		    	coinID += 1;
			  console.log('send coin location @ %d %d ID : %d',x,y,coinID);
			  io.emit('coinPosition',{x:x,y:y,coinID:coinID});
			  coinList[coinID] = true; // still alive
			  
			}, 5 * 1000);  // every 5 sec
			
			
			//blood
			var x1 = 100;
		    var y1 = 200;
		    var bloodID = 1;
		    bloodGenerator = setInterval(function(){
		    	x1 += 30;
		    	y1 += 30;
			  console.log('send blood location @ %d %d ID : %d',x1,y1,bloodID);
			  io.emit('bloodPosition',{x:x1,y:y1,bloodID:bloodID});
			  bloodList[bloodID] = true;
			 bloodID += 1;
			}, 8 * 1000);  // every 5 sec
	    }else{
	    	console.log('only 1 client now, will not generate item');
	    }
	    
	})
	
	//socket.emit('wantCollectItem',{itemID:coin.ID, itemType:'COIN'}); 
	socket.on('wantCollectItem',function(data) {
	    
	    //console.log(socket.id);
	    console.log(data);
	    //console.log(coinList);
	    //console.log(coinList[data['itemID']]);
	    
	    if(data['itemType'] == 'COIN'){
	    	// check the coin has not been taken
	    	if(coinList[data['itemID']]){
	    		console.log('coin '+ data['itemID'] +' is alive and will be collected by ..');
	    		
	    		io.emit('coinCollectConfirm',{clientID:socket.id}); // can send what back ?
	    		//var temp = socket.id;
	    		//io.temp.send('coinCollectConfirm',true); 
	    	}else{
	    		
	    		console.log('coin '+ data['itemID'] +' has been taken');
	    	}
	    	
	    }
	    
	    if(data['itemType'] == 'BLOOD'){
	    	// check the coin has not been taken
	    	if(bloodList[data['itemID']]){
	    		console.log('blood '+ data['itemID'] +' is alive and will be collected by ..');
	    		
	    		io.emit('bloodCollectConfirm',{clientID:socket.id}); // can send what back ?
	    	}else{
	    		
	    		console.log('blood '+ data['itemID'] +' has been taken');
	    	}
	    	
	    }
	    
	    
	    
	    
	})
	
}
)


// try eureca
//we'll keep clients data here
/*
var clients = {};
  
//get EurecaServer class
var EurecaServer = require('eureca.io').EurecaServer;
var eurecaServer = new EurecaServer();
//attach eureca.io to our http server
eurecaServer.attach(server);
var clients = {};

eurecaServer.onConnect(function (conn) {    
    console.log('New Client id=%s ', conn.id, conn.remoteAddress);
	
	//the getClient method provide a proxy allowing us to call remote client functions
    var remote = eurecaServer.getClient(conn.id);    // specific to the target client by its id
	
	//register the client
	// save id and remote object (remote can be used to call function on clients[conn.id])
	clients[conn.id] = {id:conn.id, remote:remote}
	
	//here we call setId (defined in the client side)
	remote.setId(conn.id);	
});

*/

function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}



