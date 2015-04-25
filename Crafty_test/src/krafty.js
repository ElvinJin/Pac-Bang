Krafty = {
	withComponents: function(componentNames) {
		var results = [];
		Crafty(componentNames).each(function() {
			results.push(this);
		});
		return results;
	}
};
