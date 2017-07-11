var Player = function() {

	var Guid = require('guid');

	var api = {};

	api.signUp = function(name) {
		if (!name) throw new Error;

		return Guid.raw();
	};

	return api;
};

module.exports = Player;
