const Player = function(dao) {

	const Guid = require('guid');

	const api = {};

	api.signUp = function(name) {
		if (!name) return Promise.reject('Failed to provide name');
		const guid = Guid.raw();

		const response = (data) => ({
			message: 'Signed up as '+data.name,
			guid: data.guid
		});

		return dao.save(name, guid).then(response);
	};

	return api;
};

module.exports = Player;
