var Player = function(dao) {

	var Guid = require('guid');

	var api = {};

	api.signUp = function(name) {
		if (!name) return Promise.reject('Failed to provide name');
		var guid = Guid.raw();

		return dao.save(name, guid).then(function(data) {
			return data['guid'];
		});
	};

	return api;
};

module.exports = Player;
