// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {
	// Player character, placed at 5, 5 on our grid
	this.player = Crafty.e('PlayerCharacter').at(5, 5);

	// Place a tree at every edge square on our grid of 16x16 tiles
	Game.mapGrid.eachTile(function(x, y) {
		var atEdge = x === 0 || x === Game.mapGrid.width - 1 || y === 0 || y === Game.mapGrid.height - 1;

		if (atEdge) {
			// Place a tree entity at the current tile
			Crafty.e('Tree').at(x, y);
		} else if (Math.random() < 0.06 && !Grid.occupied(x, y)) {
			// Place a bush entity at the current tile
			var actorComponentName = (Math.random() > 0.3) ? 'Bush' : 'Rock';
			Crafty.e(actorComponentName).at(x, y);
		}
	});

	// Generate five villages on the map in random locations
	var max_villages = 5;
	for (var x = 0; x < Game.mapGrid.width; x++) {
		for (var y = 0; y < Game.mapGrid.height; y++) {
			if (Math.random() < 0.03) {
				if (Crafty('Village').length < max_villages && !Grid.occupied(x, y)) {
					Crafty.e('Village').at(x, y);
				}
			}
		}
	}

	// Play a ringing sound to indicate the start of the journey
	Crafty.audio.play('ring');

	// Show the victory screen once all villages are visisted
	this.showVictory = this.bind('VillageVisited', function() {
		if (!Crafty('Village').length) {
			Crafty.scene('Victory');
		}
	});
}, function() {
	// Remove our event binding from above so that we don't
	//  end up having multiple redundant event watchers after
	//  multiple restarts of the game
	this.unbind('VillageVisited', this.showVictory);
});


// Victory scene
// -------------
// Tells the player when they've won and lets them start a new game
Crafty.scene('Victory', function() {
	// Display some text in celebration of the victory
	Crafty.e('2D, DOM, BoldCenteredText')
		.text('All villages visited!')
		.attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() });

	// Give'em a round of applause!
	Crafty.audio.play('applause');

	// After a short delay, watch for the player to press a key, then restart
	// the game when a key is pressed
	var delay = true;
	setTimeout(function() { delay = false; }, 5000);
	this.restart_game = function() {
		if (!delay) {
			Crafty.scene('Game');
		}
	};

	Crafty.bind('KeyDown', this.restart_game);
}, function() {
	// Remove our event binding from above so that we don't
	//  end up having multiple redundant event watchers after
	//  multiple restarts of the game
	this.unbind('KeyDown', this.restart_game);
});

// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function(){
	// Draw some text for the player to see in case the file
	//  takes a noticeable amount of time to load
	Crafty.e('2D, DOM, BoldCenteredText')
		.text('Loading; please wait...')
		.attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() });

	// Load our sprite map image
	Crafty.load([
		'assets/16x16_forest_2.gif',
		'assets/hunter.png',
		'assets/door_knock_3x.mp3',
		'assets/door_knock_3x.ogg',
		'assets/door_knock_3x.aac',
		'assets/board_room_applause.mp3',
		'assets/board_room_applause.ogg',
		'assets/board_room_applause.aac',
		'assets/candy_dish_lid.mp3',
		'assets/candy_dish_lid.ogg',
		'assets/candy_dish_lid.aac'
		], function(){
		// Once the images are loaded...

		// Define the individual sprites in the image
		// Each one (spr_tree, etc.) becomes a component
		// These components' names are prefixed with "spr_"
		//  to remind us that they simply cause the entity
		//  to be drawn with a certain sprite
		Crafty.sprite(16, 'assets/16x16_forest_2.gif', {
			spr_tree:    [0, 0],
			spr_bush:    [1, 0],
			spr_village: [0, 1],
			spr_rock:    [1, 1]
		});

		// Define the PC's sprite to be the first sprite in the third row of the
		//  animation sprite map
		Crafty.sprite(16, 'assets/hunter.png', {
			spr_player:  [0, 2],
		}, 0, 2);

		// Define our sounds for later use
		Crafty.audio.add({
			knock:    ['assets/door_knock_3x.mp3', 'assets/door_knock_3x.ogg', 'assets/door_knock_3x.aac'],
			applause: ['assets/board_room_applause.mp3', 'assets/board_room_applause.ogg', 'assets/board_room_applause.aac'],
			ring:     ['assets/candy_dish_lid.mp3', 'assets/candy_dish_lid.ogg', 'assets/candy_dish_lid.aac']
		});

		// Now that our sprites are ready to draw, start the game
		Crafty.scene('Game');
	});
});