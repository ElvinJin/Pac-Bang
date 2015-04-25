Game = {
	// This defines our grid's size and the size of each of its tiles
	mapGrid: Grid.create({
		width:  24,
		height: 16,
		tile: {
			width:  16,
			height: 16
		}
	}),

	// The total width of the game screen. Since our grid takes up the entire screen
	//  this is just the width of a tile times the width of the grid
	width: function() {
		return this.mapGrid.width * this.mapGrid.tile.width;
	},

	// The total height of the game screen. Since our grid takes up the entire screen
	//  this is just the height of a tile times the height of the grid
	height: function() {
		return this.mapGrid.height * this.mapGrid.tile.height;
	},

	// Initialize and start our game
	start: function() {
		// Start crafty and set a background color so that we can see it's working
		Crafty.init(Game.width(), Game.height());
		Crafty.background('rgb(87, 109, 20)');

		// Simply start the "Loading" scene to get things going
		Crafty.scene('Loading');
	}
};
