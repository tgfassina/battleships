var Game = function(playerDao) {

	var api = {};

	api.create = function(guid) {
		if (!guid) return Promise.reject();

		return playerDao.findByGuid(guid).then(function(data) {
			if (!data) return Promise.reject();

			return '0123456789'+'0123456789'+'0123';
		});
	};

	return api;
};

module.exports = Game;
