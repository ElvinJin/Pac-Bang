// set up a player class


var updateInformationTemp;
var generateItemTemp;
var counterPartyEmitTemp;
// game end
var gameEndTemp; 
var playerDiedTemp; 
var confirmEnemyDestroyTemp;
var confirmSpeedUpTemp; 
// for remote controller

var remoteEmitTemp; 

var remoteMoveTemp;
//var uername;
//var username1;

BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:
    
    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};


// unique ID - this.myID

BasicGame.Game.prototype = {

    create: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        this.bg = this.add.tileSprite(0, 0, 1280, 640, 'background');
        this.bg.fixedToCamera = true;

        this.map = this.add.tilemap('map');

        this.map.addTilesetImage('ground_1x1');
        this.map.addTilesetImage('walls_1x2');
        this.map.addTilesetImage('tiles2');

        this.map.setCollisionBetween(1, 12); // 1 12 means what ??
        //console.log('map.setCollision loaded');
        this.layer = this.map.createLayer('Tile Layer 1');
        //console.log('map.createLayer loaded');

        this.layer.resizeWorld();
        
        // 
        //this.layer2 = this.map.createLayer('Image Layer 1');
        //this.layer2.resizeWorld();

        this.physics.startSystem(Phaser.Physics.ARCADE);
        //console.log('startSystem loaded');

        // ===================== add coins ===============
        /*
        this.coins = this.add.group();
        this.coins.enableBody = true;

        // coin is static
        //  And now we convert all of the Tiled objects with an ID of 34 into sprites within the coins group
        
        this.map.createFromObjects('Object Layer 1', 34, 'coin', 0, true, false, this.coins);

        //  Add animations to all of the coin sprites
        this.coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
        this.coins.callAll('animations.play', 'animations', 'spin');
        */
        
        
        // set up timer
        this.setUpTimer();
        this.setupPlayer();
        this.setupBullets();
        this.setupExplosions();
        this.bulletIconPool = this.add.group(); // hold bullet deposit icon
    
       
        // set up items
        this.setUpItems();
        //this.setRepeatGeneration();

        // game pad indicator
        // =========================
        this.setUpGamePad();
        this.gamePadConnected = true;
        
        

        // ================
        this.cursors = this.input.keyboard.createCursorKeys();

        //===============
        // add score text

        this.informationDisplay();
    
    
        // try quit game
        //this.time.events.add(Phaser.Timer.SECOND * 10, this.quitGame, this);
        
        
        // try socket
        var client = this; // warp the binding
        
        
        //this.counterPartyName = 'testName';
        
        //socket.emit('hi','hi there');
        
        //tempRecord=client.receiveFromServer;
        //client.receiveFromServer.bind(this);
        /*
        socket.on('register',client.receiveFromServer.bind(this));
        socket.on('updateInformation',client.updateInformation.bind(this)); // for player position
        
        // listen for item generation
        socket.on('generateItem',client.generateItem.bind(this));
        // player2 emit bullet added
        socket.on('counterPartyEmit',client.counterPartyEmit.bind(this));  // ok
        socket.on('')
        // game end
        socket.on('gameEnd',client.gameEnd.bind(this));
        socket.on('playerDied',client.playerDied.bind(this));
        
        // for remote controller
        
        
        socket.on('remoteEmit',client.remoteEmit.bind(this));
        socket.on('remoteMove',client.remoteMove.bind(this));
        */
        
        // server can generate items
        //this.serverCanGenCoins();
        //socket.emit('ready',{clientID:123});
        //eurecaClientSetup();
        
        updateInformationTemp = client.updateInformation.bind(this);
        
        //window.addEventListener('register',client.receiveFromServer.bind(this));
        window.addEventListener('updateInformation',updateInformationTemp); // ok
        generateItemTemp = client.generateItem.bind(this);
        // listen for item generation
        window.addEventListener('generateItem',generateItemTemp);
        // player2 emit bullet added
        counterPartyEmitTemp = client.counterPartyEmit.bind(this);
        window.addEventListener('counterPartyEmit',counterPartyEmitTemp);  // ok
        
        // game end
        gameEndTemp = client.gameEnd.bind(this);
        window.addEventListener('gameEnd',gameEndTemp); // ok
        playerDiedTemp = client.playerDied.bind(this);
        window.addEventListener('playerDied',playerDiedTemp); // ok
        confirmEnemyDestroyTemp = client.confirmEnemyDestroy.bind(this);
        window.addEventListener('enemyDestroy',confirmEnemyDestroyTemp); // xxxxxxx
        confirmSpeedUpTemp = client.confirmSpeedUp.bind(this);
        window.addEventListener('speedUp',confirmSpeedUpTemp); // ok
        // for remote controller
        
        remoteEmitTemp = client.remoteEmit.bind(this);
        
        window.addEventListener('remoteShoot',remoteEmitTemp);
        
        remoteMoveTemp = client.remoteMove.bind(this);
        window.addEventListener('remoteMove',remoteMoveTemp);
        
        this.backgroundMusic = this.game.add.audio('backgroundMusic');
        this.backgroundMusic.volume = 0.3;
        this.backgroundMusic.loop = true;
        this.backgroundMusic.play();
        
        this.emitBulletMusic = this.game.add.audio('emitBulletMusic');
        this.emitBulletMusic.volume = 1;
        
        this.explosionMusic = this.game.add.audio('explosionMusic');
        this.explosionMusic.volume = 1;
        

        // server can generate items
        //this.serverCanGenCoins();
        //socket.emit('ready',{clientID:123});
        gc.ready();
        //gc.createRoom({});
        
        //this.check = true;
        

    },
    
    updateInformation:function(data){
        ////console.log(data['clientID']);
        // this pos is counterpartiy's
        ////console.log(data);
            
        // just update 
        ////console.log(data.detail['px'] + ' ' + data.detail['py'] + 'myscore : ' + data.detail['myHp'] + ' ' + data.detail['oppHp']);
        
        this.player2.x = data.detail['px'];
        this.player2.y = data.detail['py'];
        this.player2.direction = data.detail['dir'];
        
        this.player.score = data.detail['myScore'];
        this.player.health = data.detail['myHp'];
        this.player.playerBulletNumber = data.detail['myBullet'];
        // bullet number ??
        
        this.player2.score = data.detail['oppScore'];
        this.player2.health = data.detail['oppHp'];
        this.player2.playerBulletNumber = data.detail['oppBullet'];
            
            
            // update player2 direction
        
        
    },

    update: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        this.checkCollisions();
        
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        
        if(this.gamePadConnected){
            this.gamePadControl();
        }else{
            this.processPlayerInput();
        }
        
        this.updatePlayer2Animation();
        
        //this.enemyFire();


        // updtae information for player
        this.t.setText( this.scoreString + this.player.score);
        this.healthInform.setText( 'HP : '+this.player.health);
        this.speedInform.setText('Speed : '+this.player.speed);
        this.bulletInform.setText('Bullet : '+this.player.playerBulletNumber);
        // update inform for player2
        this.score2.setText('Score: ' + this.player2.score);
        this.healthInform2.setText( 'HP : '+this.player2.health);
        this.hisName.setText( 'Name: ' + this.player2.name);
        
        // send back player position information
        // or only when it change ?
        //socket.emit('updatePlayer',{positionX:this.player.position.x, positionY:this.player.position.y,direction:this.player.direction});
        //if(this.check){
            gc.updatePlayer({px:this.player.position.x, py:this.player.position.y,direction:this.player.direction});
        //}

        //this.check = !this.check;
    },
    
    render: function(){
        
        // debug mode on
        //is.game.debug.body(this.bullet);
        //this.game.debug.body(this.player);
        // If our timer is running, show the time in a nicely formatted way, else show 'Done!'
        if (this.timer.running) {
            this.game.debug.text(this.formatTime(Math.round((this.timerEvent.delay - this.timer.ms) / 1000)), 565, 660, "#ff0");
        }
        else {
            this.game.debug.text("Hi Mole!", 565, 660, "#0f0");
            
            // show score, winner
            
            // quit game
            //this.quitGame();
            
        }
        
    },
    
    formatTime: function(s) {
        // Convert seconds (s) to a nicely formatted and padded time string
        var minutes = "0" + Math.floor(s / 60);
        var seconds = "0" + (s - minutes * 60);
        return minutes.substr(-2) + ":" + seconds.substr(-2);   
    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');
        
        

    },
    
    
    setUpTimer:function(){
        
        // Create a custom timer
        this.timer = this.time.create();
        // Create a delayed event 1m and 30s from now
        this.timerEvent = this.timer.add(BasicGame.Game_Time, this.endTimer, this);
        // Start the timer
        this.timer.start();
    },
    
    endTimer: function() {
        // Stop the timer when the delayed event triggers
        this.timer.stop();
    },

    setupPlayer: function(){
        
        
        this.player = this.add.sprite(260, 100, 'phaser');
        this.player.anchor.setTo(0.5,0.5);
        ////console.log('player.anchor loaded');
        this.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.setSize(30,30,0,0);
        this.player.animations.add('idle',[5],10,true); // no move
        this.player.animations.add('right',[0,1,2,3],10,true);
        this.player.animations.add('left',[7,8,9,10],10,true);
        ////console.log('player.animations loaded');

        this.camera.follow(this.player);
        ////console.log('camera loaded');


        // add button to trigger items
        this.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.fireButton.onDown.add(this.fire, this);
        ////console.log('fireButton loaded');
        //this.input.keyboard.onDown.add(this.fire, this);
        this.superFireButton = this.input.keyboard.addKey(Phaser.Keyboard.Z);
        ////console.log('superButton loaded');
        //this.superFireButton.onDown.add(this.superFire, this);

        ////console.log('player.anchor loaded');
        this.player.direction = 'no';


        // player initial speed
        this.player.speed = BasicGame.PlayerInitSpeed;
        ////console.log('player.speed loaded');
        this.player.crazyBullet = 0;

        this.player.playerBulletNumber = 3;
        this.player.health = BasicGame.PlayerInitHealth;
        this.player.score = 0;
        // when player died, remove all effect
        this.player.died = false;
        
        // duplicate a player, it has no control function, just 
        this.player2 = this.add.sprite(260, 100, 'player2');
        this.player2.anchor.setTo(0.5,0.5);

        this.physics.enable(this.player2, Phaser.Physics.ARCADE);
        this.player2.body.setSize(30,30,0,0);
        this.player2.animations.add('idle',[5],10,true); // no move
        this.player2.animations.add('right',[0,1,2,3],10,true);
        this.player2.animations.add('left',[7,8,9,10],10,true);
        this.player2.playerBulletNumber = 3;
        this.player2.health = BasicGame.PlayerInitHealth;
        this.player2.score = 0;
        this.player2.name = username1;
        this.player2.direction = 'no';

    },

    processPlayerInput: function(){

       
        if(this.cursors.up.isDown ||this.cursors.down.isDown || this.cursors.left.isDown ||this.cursors.right.isDown){

            if (this.cursors.up.isDown)
            {
                this.player.body.velocity.y = -this.player.speed;
                this.player.direction = 'up';
                //socket.emit('update',{id:1, posX:this.player.position.x,  posY:this.player.position.y});
            }
            else if (this.cursors.down.isDown)
            {
                this.player.body.velocity.y = this.player.speed;
                this.player.direction = 'down';
                //socket.emit('update',{id:1, posX:this.player.position.x,  posY:this.player.position.y});
            }
            
            
            if (this.cursors.left.isDown)
            {
                this.player.body.velocity.x = -this.player.speed;
                this.player.animations.play('left');
                this.player.direction = 'left';
                //socket.emit('update',{id:1, posX:this.player.position.x,  posY:this.player.position.y});
    
            }
            else if (this.cursors.right.isDown)
            {
                this.player.body.velocity.x = this.player.speed;
                this.player.animations.play('right');
                this.player.direction = 'right';
                //socket.emit('update',{id:1, posX:this.player.position.x,  posY:this.player.position.y});
    
            }
        }
        else{
            this.player.animations.play('idle');
            this.player.direction = 'no';
        }
    },
    
    confirmEnemyDestroy:function(data){
        
        var id = data.detail; // id of enemy to be killed;
        this.enemyPool.forEach(function(item) {
            if(item.ID == id){
                this.bigExplode(item);
                item.kill();
            }
          
        }, this);
    },
    
    confirmSpeedUp:function(data){
        
        if(this.player.speed + BasicGame.SpeedUpStep <= BasicGame.PlayerMaxSpeed){
            this.player.speed += BasicGame.SpeedUpStep;

            //console.log("player take Speed Up Item, speed up by " + BasicGame.SpeedUpStep + " Current Speed = " + this.player.speed);
            // set function to be called after pre-set time
            this.player.died = false;
            this.time.events.add(Phaser.Timer.SECOND * BasicGame.SpeedUpTime, this.lowerSpeed, this);

        }else{

            //console.log('Max speed now, cannot to faster');

        }
    },
    
    remoteMove:function(data){
        
        var direction = data.detail['direction'];
        var status = data.detail['type'];
        
        // update cursor status
        if(direction == 'left'){
            
            if(status == 'on'){
                this.cursors.left.isDown = true;
            }else{
                this.cursors.left.isDown = false;
            }
        }
        
        if(direction == 'right'){
            
            if(status == 'on'){
                this.cursors.right.isDown = true;
            }else{
                this.cursors.right.isDown = false;
            }
        }
        if(direction == 'up'){
            
            if(status == 'on'){
                this.cursors.up.isDown = true;
            }else{
                this.cursors.up.isDown = false;
            }
        }
        if(direction == 'down'){
            
            if(status == 'on'){
                this.cursors.down.isDown = true;
            }else{
                this.cursors.down.isDown = false;
            }
        }
        
        
    },
    
    
    
    updatePlayer2Animation:function(){
            
        if(this.player2.direction == 'up'){
            // animation
        }else if(this.player2.direction =='down'){
            // animation
        }else if(this.player2.direction=='left'){
            this.player2.animations.play('left');
        }else if(this.player2.direction=='right'){
            this.player2.animations.play('right');
        }else{
            this.player2.animations.play('idle');
        }
    },

    informationDisplay:function(){

        // score bar
        this.scoreString = 'Score : ';


        this.t = this.add.text(20,660,  this.scoreString + this.player.score, { font: "18px Arial", fill: "#ffffff", align: "center" });
        this.t.fixedToCamera = true;
        this.t.cameraOffset.setTo(20, 660);

        // player health
        this.healthInform = this.add.text(150,660, 'HP : '+this.player.health, { font: "18px Arial", fill: "#ffffff", align: "center" });
        this.healthInform.fixedToCamera = true;

        this.speedInform = this.add.text(240,660, 'Speed : '+this.player.speed, { font: "18px Arial", fill: "#ffffff", align: "center" });
        this.speedInform.fixedToCamera = true;

        // bullet inform
        this.bulletInform = this.add.text(370,660, 'Bullet : '+this.player.playerBulletNumber, { font: "18px Arial", fill: "#ffffff", align: "center" });
        this.bulletInform.fixedToCamera = true;
        
        // display information to player2
        this.hisName = this.add.text(800,660,  'Name: ' + this.player2.name, { font: "18px Arial", fill: "#ffffff", align: "center" });
        this.hisName.fixedToCamera = true;
        this.score2 = this.add.text(930,660,  'Score: ' + this.player2.score, { font: "18px Arial", fill: "#ffffff", align: "center" });
        this.score2.fixedToCamera = true;
        //this.score2.cameraOffset.setTo(400, 590);

        // player health
        this.healthInform2 = this.add.text(1050,660, 'HP : '+this.player2.health, { font: "18px Arial", fill: "#ffffff", align: "center" });
        this.healthInform2.fixedToCamera = true;
    },

    checkCollisions: function(){


        this.physics.arcade.collide(this.player, this.layer); // player cannot go through wall
        this.physics.arcade.collide(this.player2, this.layer); 
        this.physics.arcade.collide(this.player, this.player2)
        //this.physics.arcade.collide(this.bulletPool, this.layer);
        //this.physics.arcade.overlap(this.player, this.coins, this.collectCoin, null, this);

        // bullet explode at wall
        // this is at client side, no need to change
        this.physics.arcade.overlap(this.bulletPool, this.layer, this.bulletHitWall, null, this);
        this.physics.arcade.overlap(this.enemyBulletPool, this.layer, this.enemyBulletHitWall, null, this);


        // overlap with items
        this.physics.arcade.overlap(this.player, this.speedUpPool, this.speedUpEvent, null, this); // ok
        this.physics.arcade.overlap(this.player, this.bulletAddPool, this.bulletAddEvent, null, this); // ok
        //this.physics.arcade.overlap(this.player, this.bloodPool, this.bloodAddEvent, null, this);
        this.physics.arcade.overlap(this.player, this.bloodPool, this.bloodAddToServer, null, this); // ok
        // collect coins
        //this.physics.arcade.overlap(this.player, this.coinPool, this.collectCoin, null, this);
        this.physics.arcade.overlap(this.player, this.coinPool, this.collectCoinToServer, null, this); // ok
        this.physics.arcade.overlap(this.player, this.enemyPool, this.playerHitEnemy, null, this); 
        
        
        this.physics.arcade.overlap(this.player2, this.bulletAddPool, function(player,bulletAdd){
            bulletAdd.kill();
        }, null, this); // ok
        this.physics.arcade.overlap(this.player2, this.bloodPool, function(player,blood){
            blood.kill();
        }, null, this); // ok
        this.physics.arcade.overlap(this.player2, this.coinPool, function(player,coin){
            coin.kill();
        }, null, this); // ok
        this.physics.arcade.overlap(this.player2, this.speedUpPool, function(player,speedUp){
            speedUp.kill();
        }, null, this); // ok
        
        // player's bullet hit enemy
        this.physics.arcade.overlap(this.bulletPool, this.enemyPool, this.bulletHitEnemy, null, this); // ok
        // player bullet hit player2
        
        this.physics.arcade.overlap(this.bulletPool, this.player2, this.bulletHitCounterparty, null, this);
        // try player 1
         //this.physics.arcade.overlap(this.bulletPool, this.player, this.test, null, this);
        
        // enemy's bullet hit player
        //this.physics.arcade.overlap(this.player,this.enemyBulletPool,this.enemyBullletHitPlayer,null,this);
        
        // enemy's bullet hit items, will destory them
        //this.physics.arcade.overlap(this.coinPool,this.enemyBulletPool,this.enemyBulletHitUItem,null,this);
        //this.physics.arcade.overlap(this.speedUpPool,this.enemyBulletPool,this.enemyBulletHitUItem,null,this);
        //this.physics.arcade.overlap(this.bloodPool,this.enemyBulletPool,this.enemyBulletHitUItem,null,this);
        //this.physics.arcade.overlap(this.bulletAddPool,this.enemyBulletPool,this.enemyBulletHitUItem,null,this);

        // player's bullet hit enemy's bullet
        //this.physics.arcade.overlap(this.bulletPool,this.enemyBulletPool,this.pBulletHitEBullet,null,this);
        
        // player2  will just kill enemy, just add effect
        this.physics.arcade.overlap(this.enemyBulletPool,this.enemyPool,this.hisBulletHitEnemy,null,this);
        this.physics.arcade.overlap(this.enemyBulletPool,this.player,this.hisBulletHitPlayer,null,this);
        this.physics.arcade.overlap(this.player2,this.enemyPool,this.oppHitEnemy,null,this);
     

    },
    
    test:function(bullet,player){
        
    },
    
    oppHitEnemy:function(player, enemy){
        
        //this.bigExplode(enemy);
        this.enemyGreatExplode(enemy);
        enemy.kill();
        
    },
    
    hisBulletHitEnemy:function(bullet,enemy){
        //console.log('counterparty hit enemy');
        //this.bigExplode(enemy);
        this.enemyGreatExplode(enemy);
        bullet.kill();
        enemy.kill();
        
    },
   
   hisBulletHitPlayer:function(ob1,ob2){
       //console.log('counterparty hit player!');
       //this.bigExplode(ob2);
       this.playerBleeding(ob2);
       ob2.kill();
   },
    
    /*
    coinCollectConfirm:function(data){
        //console.log('Coin collected');
        this.updateScore(this.player,BasicGame.SCORELEVEL[0]);
          
    },
    */
    
    
    setupBullets:function(){

        // use Groups to manage the sprites,
        this.bulletPool = this.add.group();
        // Enable physics to the whole sprite group
        this.bulletPool.enableBody = true;
        this.bulletPool.physicsBodyType = Phaser.Physics.ARCADE;
        // Add 100 'bullet' sprites in the group.
        // By default this uses the first frame of the sprite sheet and
        // sets the initial state as non-existing (i.e. killed/dead)
        this.bulletPool.createMultiple(100, 'bullet');
        // Sets anchors of all sprites
        this.bulletPool.setAll('anchor.x', 0.5);
        this.bulletPool.setAll('anchor.y', 0.5);
        // Automatically kill the bullet sprites when they go out of bounds
        this.bulletPool.setAll('outOfBoundsKill', true);
        this.bulletPool.setAll('checkWorldBounds', true);

        // enemy bullets
        this.enemyBulletPool = this.add.group();
        // Enable physics to the whole sprite group
        this.enemyBulletPool.enableBody = true;
        this.enemyBulletPool.physicsBodyType = Phaser.Physics.ARCADE;
        // Add 100 'bullet' sprites in the group.
        // By default this uses the first frame of the sprite sheet and
        // sets the initial state as non-existing (i.e. killed/dead)
        this.enemyBulletPool.createMultiple(BasicGame.NoOfEnemyBullet, 'enemyBullet');
        // Sets anchors of all sprites
        this.enemyBulletPool.setAll('anchor.x', 0.5);
        this.enemyBulletPool.setAll('anchor.y', 0.5);
        // Automatically kill the bullet sprites when they go out of bounds
        this.enemyBulletPool.setAll('outOfBoundsKill', true);
        this.enemyBulletPool.setAll('checkWorldBounds', true);
    },

    fire:function(){


            // if player has been destory or no deposit, cannot emit bullet
            if(!this.player.alive){
                //console.log('player died when call fire()');
                return;
            }
            if( this.player.playerBulletNumber <= 0 ){
                //console.log('No bullet deposit!');
                return;
            }
            
            if(this.player.direction == 'no'){
                //console.log('cannot emit at static');
                return;
            }
            //lower deposit
            //this.player.playerBulletNumber -= 1;
            this.emitBulletMusic.play();
            /*
            var bulletIcon = this.bulletIconPool.getFirstAlive();
            bulletIcon.kill();
            */
            
            
            // Find the first dead bullet in the pool
            var bullet = this.bulletPool.getFirstExists(false);
            // Reset (revive) the sprite and place it in a new location
            bullet.reset(this.player.x, this.player.y);
            


            //speed and direction
            if(this.player.direction == 'left'){
                bullet.body.velocity.x = -BasicGame.BULLET_VELOCITY;
            }
            if(this.player.direction == 'right'){
                bullet.body.velocity.x = BasicGame.BULLET_VELOCITY;
            }
            if(this.player.direction == 'up'){
                bullet.body.velocity.y = -BasicGame.BULLET_VELOCITY;
            }
            if(this.player.direction == 'down'){
                bullet.body.velocity.y = BasicGame.BULLET_VELOCITY;
            }
            
            // tell server
            //socket.emit('emitBullet',{positionX:this.player.x,positionY:this.player.y, velocityX:bullet.body.velocity.x,velocityY:bullet.body.velocity.y})
            gc.emitBullet({px:this.player.x,py:this.player.y, vx:bullet.body.velocity.x,vy:bullet.body.velocity.y})


    },
    
    
    // remote emit
    remoteEmit:function(data){
        
        //console.log('remote emit');
        this.fire();    
    },
    /*
    superFire:function(){

        //console.log('player hit Z');
    },
    */
    
    /*
    enemyFire:function(){
         //iterating over the live shooters in the world
         this.enemyPool.forEachAlive(function (enemy) {
            if (this.time.now > enemy.nextShotAt && this.enemyPool.countDead() > 0) {
                var bullet = this.enemyBulletPool.getFirstExists(false);
                if(bullet){
                    bullet.reset(enemy.x, enemy.y);
                    // random speed
                    bullet.body.velocity.x = this.rnd.integerInRange(-200,200);
                    bullet.body.velocity.y = this.rnd.integerInRange(-200,200);
                    enemy.nextShotAt = this.time.now + BasicGame.Enemy_Shot_Dealy;
                }

            }
        }, this);

    },
    */
    
    counterPartyEmit:function(data){
        
        //console.log(data.detail);
        
        var x = data.detail['px'];
        var y = data.detail['py'];
        var vX = data.detail['vx'];
        var vY = data.detail['vy'];
        
        if (this.enemyPool.countDead() > 0) {
            var bullet = this.enemyBulletPool.getFirstExists(false);
            if(bullet){
                bullet.reset(x, y);
                // random speed
                bullet.body.velocity.x = vX;
                bullet.body.velocity.y =vY;
                this.emitBulletMusic.play();
               
            }

        }
    },

    bulletHitWall:function(bullet,tile){

        ////console.log('bullet hit wall!');

        this.explode(bullet);

        bullet.kill();
        //wall.kill();
        this.map.removeTile(tile.x, tile.y);
        // add effect


        // add score
        //this.updateScore(this.player, 2);



    },

    enemyBulletHitWall:function(bullet,tile){
        ////console.log('bullet hit wall!');

        this.explode(bullet);

        bullet.kill();
        this.map.removeTile(tile.x, tile.y);
    },
    
    /*
    pBulletHitEBullet:function(pBullet,eBullet){
        this.explode(pBullet);
        pBullet.kill();
        eBullet.kill();

    },
    */

    setupExplosions:function(){

        this.explosionPool = this.add.group();
        this.explosionPool.enableBody = true;
        this.explosionPool.physicsBodyType = Phaser.Physics.ARCADE;
        this.explosionPool.createMultiple(100, 'explosion'); // max 100 explosion in one screen?
        this.explosionPool.setAll('anchor.x', 0.5);
        this.explosionPool.setAll('anchor.y', 0.5);
        this.explosionPool.forEach(function (explosion) {
          explosion.animations.add('boom');
        });

        // explosion for enemy
        this.enemyExplosionPool = this.add.group();
        this.enemyExplosionPool.enableBody = true;
        this.enemyExplosionPool.physicsBodyType = Phaser.Physics.ARCADE;
        this.enemyExplosionPool.createMultiple(100, 'kaboom'); // max 100 explosion in one screen?
        this.enemyExplosionPool.setAll('anchor.x', 0.5);
        this.enemyExplosionPool.setAll('anchor.y', 0.5);
        this.enemyExplosionPool.forEach(function (explosion) {
          explosion.animations.add('kaboom');
        });
        
        // enemy exploded
        this.enemyGreatExplosionPool = this.add.group();
        this.enemyGreatExplosionPool.enableBody = true;
        this.enemyGreatExplosionPool.physicsBodyType = Phaser.Physics.ARCADE;
        this.enemyGreatExplosionPool.createMultiple(100, 'enemyExplode'); // max 100 explosion in one screen?
        this.enemyGreatExplosionPool.setAll('anchor.x', 0.5);
        this.enemyGreatExplosionPool.setAll('anchor.y', 0.5);
        this.enemyGreatExplosionPool.forEach(function (explosion) {
          explosion.animations.add('enemyExplode');
          
        });
        
        // bleeding effect
        this.bleedingPool = this.add.group();
        this.bleedingPool.enableBody = true;
        this.bleedingPool.physicsBodyType = Phaser.Physics.ARCADE;
        this.bleedingPool.createMultiple(100, 'bleeding'); // max 100 explosion in one screen?
        this.bleedingPool.setAll('anchor.x', 0.5);
        this.bleedingPool.setAll('anchor.y', 0.5);
        this.bleedingPool.forEach(function (explosion) {
          explosion.animations.add('playerBleeding');
          
        });
        
    },

    explode: function(sprite){

        if (this.explosionPool.countDead() === 0) {
            return;
        }

        var explosion = this.explosionPool.getFirstExists(false);
        explosion.reset(sprite.x, sprite.y);
        explosion.play('boom', 15, false, true);
        // add the original sprite's velocity to the explosion
        explosion.body.velocity.x = sprite.body.velocity.x;
        explosion.body.velocity.y = sprite.body.velocity.y;


    },

    bigExplode:function(sprite){
        if (this.enemyExplosionPool.countDead() === 0) {
            return;
        }

        var explosion = this.enemyExplosionPool.getFirstExists(false);
        explosion.reset(sprite.x, sprite.y);
        explosion.play('kaboom', 15, false, true);
        // add the original sprite's velocity to the explosion
        explosion.body.velocity.x = sprite.body.velocity.x;
        explosion.body.velocity.y = sprite.body.velocity.y;
        
        this.explosionMusic.play();
    },
    
    enemyGreatExplode:function(sprite){
        if (this.enemyGreatExplosionPool.countDead() === 0) {
            return;
        }

        var explosion = this.enemyGreatExplosionPool.getFirstExists(false);
        explosion.reset(sprite.x, sprite.y);
        explosion.play('enemyExplode', 15, false, true);
        // add the original sprite's velocity to the explosion
        explosion.body.velocity.x = sprite.body.velocity.x;
        explosion.body.velocity.y = sprite.body.velocity.y;
        
        this.explosionMusic.play();
        
    },
    
    
    playerBleeding:function(sprite){
        if (this.bleedingPool.countDead() === 0) {
            return;
        }

        var bleeding = this.bleedingPool.getFirstExists(false);
        bleeding.reset(sprite.x, sprite.y);
        bleeding.play('playerBleeding', 15, false, true);
        // add the original sprite's velocity to the bleeding
        bleeding.body.velocity.x = sprite.body.velocity.x;
        bleeding.body.velocity.y = sprite.body.velocity.y;
        
        this.explosionMusic.play();
    },

    setUpItems:function(){

        // randomly generated coins scatter around randomly
        this.coinPool = this.add.group();
        this.coinPool.enableBody = true;
        this.coinPool.physicsBodyType = Phaser.Physics.ARCADE;
        this.coinPool.createMultiple(BasicGame.NumOfCoins, 'coin');
        this.coinPool.setAll('anchor.x', 0.5);
        this.coinPool.setAll('anchor.y', 0.5);
        this.coinPool.setAll('outOfBoundsKill', true);
        this.coinPool.setAll('checkWorldBounds', true);
        this.coinPool.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
        this.coinPool.callAll('animations.play', 'animations', 'spin');


        this.speedUpPool = this.add.group();
        this.speedUpPool.enableBody = true;
        this.speedUpPool.physicsBodyType = Phaser.Physics.ARCADE;
        this.speedUpPool.createMultiple(BasicGame.NumOfSpeedUp, 'speedUp');
        this.speedUpPool.setAll('anchor.x', 0.5);
        this.speedUpPool.setAll('anchor.y', 0.5);
        this.speedUpPool.setAll('outOfBoundsKill', true);
        this.speedUpPool.setAll('checkWorldBounds', true);
        this.speedUpPool.callAll('animations.add', 'animations', 'speedUpEffect', [0, 1, 2, 3], 10, true);
        this.speedUpPool.callAll('animations.play', 'animations', 'speedUpEffect');

        this.bulletAddPool = this.add.group();
        this.bulletAddPool.enableBody = true;
        this.bulletAddPool.physicsBodyType = Phaser.Physics.ARCADE;
        this.bulletAddPool.createMultiple(BasicGame.NumOfBulletAdd, 'bulletAdd');
        this.bulletAddPool.setAll('anchor.x', 0.5);
        this.bulletAddPool.setAll('anchor.y', 0.5);
        this.bulletAddPool.setAll('outOfBoundsKill', true);
        this.bulletAddPool.setAll('checkWorldBounds', true);

        this.bloodPool = this.add.group();
        this.bloodPool.enableBody = true;
        this.bloodPool.physicsBodyType = Phaser.Physics.ARCADE;
        this.bloodPool.createMultiple(BasicGame.NumOfBlood, 'medicine');
        this.bloodPool.setAll('anchor.x', 0.5);
        this.bloodPool.setAll('anchor.y', 0.5);
        this.bloodPool.setAll('outOfBoundsKill', true);
        this.bloodPool.setAll('checkWorldBounds', true);
        this.bloodPool.callAll('animations.add', 'animations', 'medicineEffect',[0,1,2,3,4,5,6,7,8,9,10,11],15,true);
        this.bloodPool.callAll('animations.play', 'animations', 'medicineEffect');
        
        
        // static enemy, can emit bullet to attack player
        this.enemyPool = this.add.group();
        this.enemyPool.enableBody = true;
        this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE;
        this.enemyPool.createMultiple(BasicGame.NumOfEnemy, 'enemy');
        this.enemyPool.setAll('anchor.x', 0.5);
        this.enemyPool.setAll('anchor.y', 0.5);
        this.enemyPool.setAll('outOfBoundsKill', true);
        this.enemyPool.setAll('checkWorldBounds', true);
        this.enemyPool.callAll('animations.add', 'animations', 'enemyEffect',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],20, true);
        this.enemyPool.callAll('animations.play', 'animations', 'enemyEffect');

        // try to put enemy
        /*
        var enemy = this.enemyPool.getFirstExists(false);
        enemy.reset(600,250);
        enemy.nextShotAt = 0; // timer for shooting
        enemy.ID = 1;
        var enemy1 = this.enemyPool.getFirstExists(false);
        enemy1.reset(800,350);
        enemy1.nextShotAt = 0
        enemy1.ID = 2;
        var enemy2 = this.enemyPool.getFirstExists(false);
        enemy2.reset(750,130);
        enemy2.nextShotAt = 0;
        enemy2.ID = 3;
        */
        
        /*
        var coin = this.coinPool.getFirstExists(false);
        coin.reset(100,100);
        coin.ID = 100;
        */

    },
    
    /*
    setRepeatGeneration:function(){

        //this.time.events.repeat(Phaser.Timer.SECOND * BasicGame.SPEEDUPINTERVAL, 1000, this.generateSpeedUp, this); //
        //this.time.events.repeat(Phaser.Timer.SECOND * BasicGame.BulletAddInterval, 1000, this.generateBulletAdd, this);
        //this.time.events.repeat(Phaser.Timer.SECOND * BasicGame.BloodAddInterval, 1000, this.generateBlood, this);
        //this.time.events.repeat(Phaser.Timer.SECOND * BasicGame.CoinAddInterval, 1000, this.generateCoin, this);
        
        
        // repeat emit information to server to let server give back the location of the items
         //this.time.events.repeat(Phaser.Timer.SECOND * BasicGame.SPEEDUPINTERVAL, 1000, this.generateCoinToServer, this); //
    },
    */
    
    // actually can generate anything
    /*
    serverCanGenCoins:function(){
        
        socket.emit('generateCoin',{id:1111});
        // in create(), set up the event handler
    },
    */
    
    /*
    generateSpeedUp: function(){


        if(this.speedUpPool.countDead() > 0){
            //console.log('generate new speedUp item');
            var speedUp = this.speedUpPool.getFirstExists(false);
            // Reset (revive) the sprite and place it in a new location
            speedUp.reset(this.rnd.integerInRange(20, this.game.width - 20), this.rnd.integerInRange(50, this.game.height - 50));  // should maintain a list of avaiable position
            speedUp.play('speedUpEffect');

        }else{
            //console.log('No more speedUp Items')
        }

    },
    */
    /*
    generateBulletAdd:function(){
         if(this.bulletAddPool.countDead() > 0){
            //console.log('generate new bulletAdd item');
            var bulletAdd = this.bulletAddPool.getFirstExists(false);
            // Reset (revive) the sprite and place it in a new location
            bulletAdd.reset(this.rnd.integerInRange(20, this.game.width - 20), this.rnd.integerInRange(50, this.game.height - 50));  // should maintain a list of avaiable position


        }else{
            //console.log('No more bulletAdd Items')
        }

    },
    */


    speedUpEvent:function(player,speedUp){

        // kill the icon
        // may change animation of player
        speedUp.kill();
        //socket.emit('triggerItem',{itemType:'speedUp',itemID:speedUp.ID});
        gc.triggerItem({itemType:'speedUp',itemId:speedUp.ID})
        
        // increase player speed, after server tell me
        
        /*
        if(player.speed + BasicGame.SpeedUpStep <= BasicGame.PlayerMaxSpeed){
            player.speed += BasicGame.SpeedUpStep;

            //console.log("player take Speed Up Item, speed up by " + BasicGame.SpeedUpStep + " Current Speed = " + player.speed);
            // set function to be called after pre-set time
            player.died = false;
            this.time.events.add(Phaser.Timer.SECOND * BasicGame.SpeedUpTime, this.lowerSpeed, this);

        }else{

            //console.log('Max speed now, cannot to faster');

        }
        */

        // score update will leave to serve
        //this.updateScore(player,20);
        // change animation




    },

    lowerSpeed:function(){

        if(!this.player.died){
            this.player.speed -= BasicGame.SpeedUpStep;
            //console.log("player take Speed Up time up, speed down by " + BasicGame.SpeedUpStep + " Current Speed = " + this.player.speed);
        }
    },

    bulletAddEvent:function(player, bulletAdd){
        
        //socket.emit('triggerItem',{itemType:'bulletAdd',itemID:bulletAdd.ID});
        gc.triggerItem({itemType:'bulletAdd',itemId:bulletAdd.ID})
        bulletAdd.kill();
        
        // left to server
        //this.updateScore(player,30);
        //this.player.crazyBullet += 3;
        this.player.playerBulletNumber += 1;
        
        ////console.log('Player no of crazyBullet = ' + this.player.crazyBullet);

    },
    
     bloodAddToServer:function(player,blood){
        ////console.log('want to collect blood ID: ' + blood.ID);
        //socket.emit('triggerItem',{itemType:'blood',itemID:blood.ID});
        gc.triggerItem({itemType:'blood',itemId:blood.ID})
        blood.kill()
        //socket.emit('wantCollectItem',{clientID:this.myID,itemID:blood.ID, itemType:'BLOOD'}); // may send client's unique ID ?
        
        
        
    },
    
    collectCoinToServer:function(player, coin){
        
        //socket.emit('triggerItem',{itemType:'coin',itemID:coin.ID});
        gc.triggerItem({itemType:'coin',itemId:coin.ID})
        coin.kill();
        
        //socket.emit('wantCollectItem',{clientID:this.myID,itemID:coin.ID, itemType:'COIN'}); // may send client's unique ID ?
        
    },
    /*
    generateBlood:function(){

         if(this.bloodPool.countDead() > 0){
            //console.log('generate new blood item');
            var blood = this.bloodPool.getFirstExists(false);
            // Reset (revive) the sprite and place it in a new location
            blood.reset(this.rnd.integerInRange(20, this.game.width - 20), this.rnd.integerInRange(50, this.game.height - 50));  // should maintain a list of avaiable position


        }else{
            //console.log('No more blood Items')
        }

    },
    */
    
    /*
    generateBloodFromServer : function(data){
        
        // data.check clientID == 
        if(this.bloodPool.countDead() > 0){
            ////console.log('generate new blood item');
             //console.log("generate blood  @ pos: " + data['x'] +' ' + data['y']  + ' ID : ' + data['bloodID']);
            var blood = this.bloodPool.getFirstExists(false);
            // Reset (revive) the sprite and place it in a new location
            blood.reset(data['x'],data['y']);  // should maintain a list of avaiable position
            blood.ID = data['bloodID'];


        }else{
            //console.log('No more blood Items')
        }
    },
    */
    
    /*
    bloodAddEvent:function(player, blood){

        blood.kill();

        this.updateScore(player,BasicGame.BloodScore);

        if( this.player.health < BasicGame.PlayerMaxHealth){

            this.player.health += BasicGame.BloodAdded;
            //console.log('add blood to player, current HP : ' + this.player.health);
        }

        //console.log('add blood to player');
    },
    */
    
    /*
    bloodCollectConfirm:function(data){
        
        // check data['clientID'] == this.myID
        
        
        if(data['clientID'] == this.myID){
            this.updateScore(this.player,BasicGame.BloodScore);
    
            if( this.player.health < BasicGame.PlayerMaxHealth){
    
                this.player.health += BasicGame.BloodAdded;
                //console.log('add blood to player, current HP : ' + this.player.health);
            }
        }
    },
    */
    
    
    /*
    generateCoin:function(){
        // check data['clientID'] == this.myID
        
        if(data['clientID'] == this.myID){
             if(this.coinPool.countDead() > 0){
                //console.log('generate new coin');
                var coin = this.coinPool.getFirstExists(false);
                // Reset (revive) the sprite and place it in a new location
                coin.reset(this.rnd.integerInRange(20, this.game.width - 20), this.rnd.integerInRange(50, this.game.height - 50));  // should maintain a list of avaiable position
    
    
            }else{
                //console.log('No more coin avaiable in pool');
            }
        }
    },
    */
    
    // from server
    /*
    generateCoinFromServer : function(data){
        
        //console.log("generate coin  @ pos: " + data['x'] +' ' + data['y'] + ' ID : ' + data['coinID']);
        if(this.coinPool.countDead() > 0){
            ////console.log('generate new coin');
            var coin = this.coinPool.getFirstExists(false);
            // Reset (revive) the sprite and place it in a new location
            //coin.reset(this.rnd.integerInRange(20, this.game.width - 20), this.rnd.integerInRange(50, this.game.height - 50));  // should maintain a list of avaiable position
            coin.reset(data['x'],data['y']);
            coin.ID = data['coinID'];


        }else{
            //console.log('No more coin avaiable in pool');
        }
        
    },
    */
    /*
   generateItemHelper:function(type,objectGroup,positionX,positionY,objectID){
        
        if(objectGroup.countDead() > 0){
            ////console.log('generate new object');
            var object = objectGroup.getFirstExists(false);
            // Reset (revive) the sprite and place it in a new location
            //object.reset(this.rnd.integerInRange(20, this.game.width - 20), this.rnd.integerInRange(50, this.game.height - 50));  // should maintain a list of avaiable position
            object.reset(positionX,positionY);
            object.ID = objectID;


        }else{
            //console.log('No more ' + type + ' avaiable in pool');
        }
    },
    */
    
    generateItem:function(data){
      
      ////console.log(data.detail);
      var type = data.detail['type'];
      var x = data.detail['px'];
      var y = data.detail['py'];
      var itemID = data.detail['id'];
      ////console.log(type + ' ' + x + ' ' + y + ' ' + itemID);
      ////console.log(type == 'coin');
      
      // check type
      if(type == 'coin' ){
          if(this.coinPool.countDead() > 0){
              ////console.log('type is coin!')
            ////console.log('generate new coin');
            var coin = this.coinPool.getFirstExists(false);
            // Reset (revive) the sprite and place it in a new location
            //coin.reset(this.rnd.integerInRange(20, this.game.width - 20), this.rnd.integerInRange(50, this.game.height - 50));  // should maintain a list of avaiable position
            coin.reset(x,y);
            coin.ID = itemID;


        }else{
            //console.log('No more coin avaiable in pool');
        }
      }else if(type == 'blood'){
          
          if(this.bloodPool.countDead() > 0){
            var blood = this.bloodPool.getFirstExists(false);
            // Reset (revive) the sprite and place it in a new location
            blood.reset(x,y);  // should maintain a list of avaiable position
            //blood.scale.set(1.5, 1.5 )
            blood.ID = itemID;


        }else{
            //console.log('No more blood Items')
        }
          
      }else if(type == 'speedUp'){
          
          if(this.speedUpPool.countDead() > 0){
            
            var speedUp = this.speedUpPool.getFirstExists(false);
            // Reset (revive) the sprite and place it in a new location
            speedUp.reset(x,y);  // should maintain a list of avaiable position
            speedUp.ID = itemID;
            speedUp.play('speedUpEffect');

        }else{
            //console.log('No more speedUp Items')
        }
      }else if(type == 'bulletAdd'){ 
            
        if(this.bulletAddPool.countDead() > 0){
            
            var bulletAdd = this.bulletAddPool.getFirstExists(false);
            // Reset (revive) the sprite and place it in a new location
            bulletAdd.reset(x,y);  // should maintain a list of avaiable position
            bulletAdd.ID = itemID;


        }else{
            //console.log('No more bulletAdd Items')
        }      
      }else if(type == 'enemy'){
          
          if(this.enemyPool.countDead() > 0){
            
            var enemy = this.enemyPool.getFirstExists(false);
            // Reset (revive) the sprite and place it in a new location
            enemy.reset(x,y);  // should maintain a list of avaiable position
            enemy.ID = itemID;
           

        }else{
            //console.log('No more enemy Items')
        }
          
      }
      
    },

    playerHitEnemy:function(player, enemy){
        
        
        //console.log('plyer hit enemy');
        //socket.emit('triggerItem',{itemType:'enemyEncounter',itemId:enemy.ID});
        // add effect
        gc.triggerItem({itemType:'enemyEncounter',itemId:enemy.ID});
        
        
        // cannot know position in call back, just explode here
        //this.bigExplode(enemy);
        this.enemyGreatExplode(enemy);

        // reduce score and health --> leave to server
        //this.updateHealth(player,BasicGame.EnemyHitDamage);

        //this.updateScore(player,BasicGame.EnemyScoreReduce);
        // check health condition, if <=0, move to origin, and cannot move for several seconds
        enemy.kill();
    },

    bulletHitEnemy:function(bullet,enemy){
        //console.log('Player destory enemy by bullet!');
        // tell server
        //socket.emit('triggerItem',{itemType:'destroyEnemy',itemID:enemy.ID});
        gc.triggerItem({itemType:'enemyDestroy',itemId:enemy.ID});
        //
        
        // wait for ?
        bullet.kill();
        
        // explode enemy after server confirm
        
        //this.bigExplode(enemy);
        this.enemyGreatExplode(enemy);
        enemy.kill();
        

        // add score
        // left to server
        //this.updateScore(this.player,BasicGame.EnemyScoreAdd);


    },
    /*
    enemyBullletHitPlayer : function(player, enemyBullet){

        //console.log('counterParty bullet hit player');
        this.bigExplode(enemyBullet);
        enemyBullet.kill();
        // reduce score
        //this.updateScore(player,BasicGame.Hit_Player_Score_Reduce);
        //this.updateHealth(player,BasicGame.Hit_player_Health_damage);
    },
    */
    
    // strange bug, seems argument order is reversed
    bulletHitCounterparty:function(ob1, ob2){
        
        //console.log('hit conterParty : ' + username1);
        //socket.emit('bulletHit',{userName:this.counterPartyName});
        gc.bulletHit({username:username1});
        
        //this.bigExplode(ob1);
        this.playerBleeding(ob1);
        ob2.kill();
        
        // score and health update leave to server
        
        
    },
    
    /*
    enemyBulletHitUItem:function(item, bullet){

        this.explode(item);
        item.kill();
        bullet.kill();

    },
    */
    
    /*
    playerDead:function(player){

        player.reset(260,100);
        // disable move
        player.speed = 0;
        player.died = true;
        // add effect

        // recover
        this.time.events.add(Phaser.Timer.SECOND * BasicGame.RecoverTime,this.playerRecover,this);
    */

    playerDied:function(data){
        //console.log('player died');
        this.player.reset(260,100);
        // disable move
        this.player.speed = 0;
        this.player.died = true;
        this.time.events.add(Phaser.Timer.SECOND * BasicGame.RecoverTime,this.playerRecover,this);
    },

    playerRecover:function(){
        //console.log('times up, player can move');
        this.player.speed = BasicGame.PlayerInitSpeed;
        this.player.health = BasicGame.PlayerInitHealth;
        //
    },
    
    /*
    updateScore:function(player,amount){

        player.score += amount;
    },
    */
    
    /*
    updateHealth:function(player,amount){

        if(player.health + amount <= 0){
            //console.log('player no HP, reset')
            player.health = 0;
            this.playerDead(player);
        }else{
            player.health += amount;
        }

    },
    */
    
    
    gamePadDump:function(){
        ////console.log(this.pad1._axes[0]);
        ////console.log(this.pad1._rawPad.axes[0]);
    },
    
    setUpGamePad:function(){
        
        this.indicator = this.add.sprite(580,660, 'controller-indicator');
        this.indicator.scale.x = this.indicator.scale.y = 1.2;
        this.indicator.animations.frame = 1;
        this.indicator.fixedToCamera = true;
        this.input.gamepad.start();

        // To listen to buttons from a specific pad listen directly on that pad game.input.gamepad.padX, where X = pad 1-4
        this.pad1 = this.input.gamepad.pad1;
        this.input.onDown.add(this.gamePadDump, this);
        
        if (this.input.gamepad.supported && this.input.gamepad.active && this.pad1.connected)
        {
           
            this.gamePadConnected = true;
            
        }
    },
    
    
    gamePadControl :function(){
        
        // Pad "connected or not" indicator
        if (this.input.gamepad.supported && this.input.gamepad.active && this.pad1.connected)
        {
            this.indicator.animations.frame = 0;
            this.gamePadConnected = true;
            
        }
        else
        {
            this.indicator.animations.frame = 1;
            this.gamePadConnected = false;
            
        }
        
        //this.player.body.velocity.x = 0;
        //this.player.body.velocity.y = 0;
        
        if (this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1)
        {
            this.player.body.velocity.x = -this.player.speed;
            this.player.animations.play('left');
            this.player.direction = 'left';
        }
        else if (this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1)
        {
            this.player.body.velocity.x = this.player.speed;
            this.player.animations.play('right');
            this.player.direction = 'right';
        }
    
        if (this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1)
        {
            this.player.body.velocity.y = -this.player.speed;
            this.player.direction = 'up';
        }
        else if (this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1)
        {
            this.player.body.velocity.y = this.player.speed;
            this.player.direction = 'down';
        }else{
    
            this.player.animations.play('idle');
        }
        
        
        // emit bullet
        if (this.pad1.justPressed(Phaser.Gamepad.XBOX360_A))
        {
            this.fire();
        }
        
    },
    
    receiveFromServer:function(data){
        this.myID = data;
        //console.log('my client ID : ' + data);
    },
    
    gameEnd:function(data){
        
        // kill all object
        //this.player.destroy();
        //this.player2.destroy();
        this.enemyPool.destroy();
        this.bulletPool.destroy();
        this.enemyBulletPool.destroy();
        this.explosionPool.destroy();
        this.coinPool.destroy();
        this.bulletAddPool.destroy();
        this.speedUpPool.destroy();
        this.bloodPool.destroy();
        
        this.layer.destroy();
        
        
        // ............
        // give win or lose information ?
        
        // show score
        // may add name and winning information
        
        // actually no need to 
        //console.log(data.detail);
        var info1 = data.detail[0];
        var info2 = data.detail[1];
        
        var myScore;
        var oppScore;
        
        if(info1['name'] == username){
            myScore = info1['score'];
            oppScore = info2['score'];
        }else{
            myScore = info2['score'];
            oppScore = info1['score'];
        }
        
        var msg = 'Your Score:' + myScore + '\n' + 'counterParty Score: ' + oppScore;
        var win;
        if(myScore > oppScore){
            win = 'You Win !';
        }else if(myScore < oppScore){
            win = 'You Lose !';
        }else{
            win = 'Happy Draw !'
        }
        
        msg = msg + '\n' + win;
        
        this.endText = this.add.text(
		this.game.width / 2, this.game.height / 2 - 60, msg,
      		{ font: '72px serif', fill: '#fff' }
    	);
		this.endText.anchor.setTo(0.5, 0.5);
		this.endText.fixedToCamera = true;
		
		
		// remove socket binding
		this.customDestroy();
        
        this.time.events.add(Phaser.Timer.SECOND * 5, new_menu, this);
        
    },
    
    customDestroy:function(){
        
        // remove all registered sockets
        /*
        socket.removeAllListeners('register');
        socket.removeAllListeners('updateInformation');
        socket.removeAllListeners('generateItem');
        socket.removeAllListeners('counterPartyEmit');
        socket.removeAllListeners('registerplayerDied');
        socket.removeAllListeners('remoteEmit');
        socket.removeAllListeners('remoteMove');
        socket.removeAllListeners('canGenerate');
        socket.removeAllListeners('playerDied');
        socket.removeAllListeners('test');
        */
        
        // remove window listener
        /*
        window.removeAllListeners('updatePlayer'); // ok
        
        // listen for item generation
        window.removeAllListeners('generateItem'); // ok
        // player2 emit bullet added
        window.removeAllListeners('counterPartyEmit');  // ok
        
        // game end
        window.removeAllListeners('gameEnd');
        window.removeAllListeners('playerDied');
        window.removeAllListeners('enemyDestroy'); // xxxxxxx
        // for remote controller
        
        
        window.removeAllListeners('remoteEmit');
        window.removeAllListeners('remoteMove');
        */
        
        window.removeEventListener('updatePlayer',updateInformationTemp);
        window.removeEventListener('generateItem',generateItemTemp);
        window.removeEventListener('counterPartyEmit',counterPartyEmitTemp);
        window.removeEventListener('gameEnd',gameEndTemp);
        window.removeEventListener('playerDied',playerDiedTemp);
        window.removeEventListener('enemyDestroy',confirmEnemyDestroyTemp);
        window.removeEventListener('speedUp',confirmSpeedUpTemp);
        window.removeEventListener('remoteEmit',remoteEmitTemp);
        window.removeEventListener('remoteMove',remoteMoveTemp);
        
    }
        
        
        
     
};


       

 /*
    collectCoin:function(player, coin){
    
    
        // need to check server, whether coin with this ID exists
        //console.log('coin ID: ' + coin.ID);
        
        
        coin.kill();
        this.updateScore(player,BasicGame.SCORELEVEL[0]);


        // max bullets deposit
        if(this.player.playerBulletNumber < BasicGame.MAXBULLETS){


            // add icon
            for(var i = 0; i < BasicGame.BULLETADD;i++){
                var life = this.bulletIconPool.create(1170 -  20* this.player.playerBulletNumber- (20 * i), 600, 'bulletIcon');  // add player icon as bulletIconPool
                life.scale.setTo(0.5, 0.5);
                life.anchor.setTo(0.5, 0.5);
                life.fixedToCamera = true;
                //this.t.cameraOffset.setTo(20, 50);
            }
            //this.player.playerBulletNumber += BasicGame.BULLETADD;

        }else{
            //console.log('Bullet deposit is FULL!');
        }

        //console.log('No. of bullets = ' + this.player.playerBulletNumber);


    },
    */