var Game = function(gameDao, playerDao) {

	var api = {};

	api.create = function(guid) {
		if (!guid) return Promise.reject('Player not found');

		var rejectNotFound = function(data) {
			if (!data) return Promise.reject('Player not found');
		};

		var createGame = function() {
			return gameDao.save({});
		};

		var returnGameId = function(gameData) {
			return gameData['_id'];
		};

		return playerDao.getByGuid(guid)
			.then(rejectNotFound)
			.then(createGame)
			.then(returnGameId);
	};

	api.join = function(guid, gameId) {
		if (!guid) return Promise.reject('Player not found');

		var rejectPlayerNotFound = function(data) {
			if (!data) return Promise.reject('Player not found');
		};

		var getGame = function() {
			return gameDao.getById(gameId);
		};

		var checkAlreadyPlaying = function(gameData) {
			return Promise.reject('Already playing this game');
		};

		return playerDao.getByGuid(guid)
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
