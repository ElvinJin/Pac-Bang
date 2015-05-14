
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;
	this.ready = false;

};

BasicGame.Preloader.prototype={}

function preload_(mapname){
	console.log('modify preload function for map: '+mapname);
BasicGame.Preloader.prototype = {
	preload: function () {
		this.load.tilemap('map','assets/tilemaps/maps/'+mapname+'.json' , null, Phaser.Tilemap.TILED_JSON);
		
	    this.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
	    this.load.image('walls_1x2', 'assets/tilemaps/tiles/walls_1x2.png');
	    this.load.image('tiles2', 'assets/tilemaps/tiles/tiles2.png');
		
		//start  button
		this.load.image('playButton','assets/playButton.png');
		
		
	    //this.load.image('phaser', 'assets/sprites/phaser-dude.png');
	    this.load.spritesheet('phaser', 'assets/sprites/pacman_by_oz_28x28.png', 28, 28);
	    this.load.spritesheet('player2','assets/sprites/pacman.png',28,28);
	
	    this.load.spritesheet('coin', 'assets/sprites/coin.png', 32, 32);
	    //this.load.image('background', 'assets/games/starstruck/bg.png');
	    //this.load.image('background', 'assets/games/starstruck/background2.png');
	    this.load.image('background', 'assets/games/starstruck/background2.png');
	    
	    //this.load.image('background', 'assets/bg.png');
	    
	    // effect when player collect coin
	    this.load.spritesheet('explosion','assets/explosion.png',32,32); // for animation of explosion
	    this.load.image('bullet', 'assets/games/invaders/enemy-bullet.png');
	    // show bullet deposit
	    this.load.image('bulletIcon', 'assets/games/invaders/bullet.png');
	    
	    // sprite for items
	    this.load.spritesheet('speedUp','assets/sprites/chick.png',16,18);
	    this.load.image('bulletAdd','assets/sprites/orb-green.png');
	    this.load.image('blood','assets/sprites/tomato.png');
	    this.load.spritesheet('medicine','assets/medicine.png',30.7,20)
	    this.load.spritesheet('bleeding','assets/bleeding.png',50,50);
	    // sprite for enemy
	    //this.load.spritesheet('enemy','assets/games/starstruck/droid.png',32,32);
	    this.load.spritesheet('enemy','assets/result1.png',46.7,42);
	    this.load.spritesheet('enemyExplode','assets/explode.png',70,60);
	    this.load.spritesheet('kaboom', 'assets/games/invaders/explode.png', 128, 128); // explode for enemy
	    this.load.spritesheet('bleeding','assets/blood.png',50,50);
	    // bullet for enemy
	    this.load.image('enemyBullet','assets/enemy-bullet.png');
	    
	    // game pad indicator
	    this.load.spritesheet('controller-indicator', 'assets/controller-indicator.png', 16,16);
	    
	    
	    // music 
	    this.load.audio('backgroundMusic', 'assets/audio/GerhardtCity.mp3');
	    this.load.audio('emitBulletMusic',['assets/audio/player-fire.ogg','assets/audio/player-fire.wav']);
	    this.load.audio('explosionMusic',['assets/audio/player-explosion.ogg','assets/audio/player-explosion.wav']);

	},

	create: function () {
	},

	update: function () {
		console.log("preloader call Mainmenu.js")
		this.state.start('MainMenu');
		
	}
	

};

}
