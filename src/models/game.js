var Game = function(playerDao) {

	var api = {};

	api.create = function(guid) {
		if (!guid) return Promise.reject('Player not found');

		var rejectNotFound = function(data) {
			if (!data) return Promise.reject('Player not found');
		};

		var createGame = function() {
			var gameId = '0123456789'+'0123456789'+'0123';
			return Promise.resolve(gameId);
		};

		return playerDao.findByGuid(guid)
			.then(rejectNotFound)
			.then(createGame);
	};

	api.join = function(guid, gameId) {
		if (!guid) return Promise.reject('Player not found');

		var rejectPlayerNotFound = function(data) {
			if (!data) return Promise.reject('Player not found');
		};

		var getGame = function() {
			return Promise.reject('Game not found');
			// return gameDao.getById(gameId);
		};

		var checkAlreadyPlaying = function(gameData) {
			return Promise.reject('Already playing this game');
		};

		return playerDao.findByGuid(guid)
			.then(rejectPlayerNotFound)
			.then(getGame)
			.then(checkAlreadyPlaying)
	};

	api.place = function() {
		return Promise.reject('Invalid ship');
	};

	return api;
};

module.exports = Game;
