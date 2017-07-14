var Player = function(dao) {

	var Guid = require('guid');

	var api = {};

	api.signUp = function(name) {
		if (!name) return Promise.reject('Failed to provide name');
		var guid = Guid.raw();

		var response = function(data) {
			return {
				message: 'Signed up as '+data.name,
				guid: data.guid
			};
		};

		return dao.save(name, guid).then(response);
	};

	return api;
};

module.exports = Player;
