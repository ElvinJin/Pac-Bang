Grid = {
	_prototype: {
		printIt: function() {
			console.log('Hello');
		},

		eachTile: function(callback) {
			for (var x = 0; x < this.width; x++) {
				for (var y = 0; y < this.height; y++) {
					callback(x, y);
				}
			}
		}
	},

	create: function(config) {
		function factory() { _.extend(this, config); }
		factory.prototype = this._prototype;
		return new factory();
	},

	occupied: function(x, y) {
		return _.any(_.invoke(Krafty.withComponents('Actor'), 'at'), function(loc) {
			return loc.x === x && loc.y === y;
		});
	}
};
