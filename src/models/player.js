var Player = function(dao) {

	var Guid = require('guid');

	var api = {};

	api.signUp = function(name) {
		if (!name) return Promise.reject('Failed to provide name');
		var guid = Guid.raw();

		var returnGuid = function(data) {
			return data['guid'];
		};

		return dao.save(name, guid).then(returnGuid);
	};

	return api;
};

module.exports = Player;
