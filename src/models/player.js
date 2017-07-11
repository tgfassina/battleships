var Player = function() {

	var Guid = require('guid');

	var api = {};

	api.signUp = function() {
		return Guid.raw();
	};

	return api;
};

module.exports = Player;
