var Player = function(dao) {

	var Guid = require('guid');

	var api = {};

	api.signUp = function(name) {
		if (!name) throw new Error;
		var guid = Guid.raw();

		// dao.save(name, guid);

		return guid;
	};

	return api;
};

module.exports = Player;
