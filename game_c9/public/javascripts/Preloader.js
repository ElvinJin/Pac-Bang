var mapname='assets/tilemaps/maps/features_test.json';

BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {
		
		this.load.tilemap('map', mapname, null, Phaser.Tilemap.TILED_JSON);
		
	    this.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
	    this.load.image('walls_1x2', 'assets/tilemaps/tiles/walls_1x2.png');
	    this.load.image('tiles2', 'assets/tilemaps/tiles/tiles2.png');
		
		//start  button
		this.load.image('playButton','assets/playButton.png');
		
		
	    //this.load.image('phaser', 'assets/sprites/phaser-dude.png');
	    this.load.spritesheet('phaser', 'assets/sprites/pacman_by_oz_28x28.png', 28, 28);
	
	    this.load.spritesheet('coin', 'assets/sprites/coin.png', 32, 32);
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
	    
	    // sprite for enemy
	    this.load.spritesheet('enemy','assets/games/starstruck/droid.png',32,32);
	    this.load.spritesheet('kaboom', 'assets/games/invaders/explode.png', 128, 128); // explode for enemy
	    // bullet for enemy
	    this.load.image('enemyBullet','assets/enemy-bullet.png');
	    
	    // game pad indicator
	    this.load.spritesheet('controller-indicator', 'assets/controller-indicator.png', 16,16);

	},

	create: function () {
	},

	update: function () {
		console.log("preloader call Mainmenu.js")
		this.state.start('MainMenu');
		
	}
	

};
