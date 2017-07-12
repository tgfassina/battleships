var Game = function(playerDao) {

	var api = {};

	api.create = function(guid) {
		if (!guid) return Promise.reject('Failed to provide guid');

		return playerDao.findByGuid(guid).then(function(data) {
			if (!data) return Promise.reject('Invalid guid');

			return '0123456789'+'0123456789'+'0123';
		});
	};

	api.join = function(guid) {
		if (!guid) return Promise.reject('Failed to provide guid');

		return playerDao.findByGuid(guid).then(function(data) {
			if (!data) return Promise.reject('Invalid guid');

			return Promise.reject('Already playing this game');
		});
	};

	api.place = function() {
		return Promise.reject('Invalid ship');
	};

	return api;
};

module.exports = Game;
