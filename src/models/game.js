var Game = function(gameDao, playerDao) {

	var api = {};

	api.create = function(guid) {
		if (!guid) return Promise.reject('Player not found');

		var rejectNotFound = function(data) {
			if (!data) return Promise.reject('Player not found');
		};

		var createGame = function() {
			var gameData = initGame(guid);
			return gameDao.save(gameData);
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
			if (gameData.player1 === guid) {
				return Promise.reject('Already playing this game');
			}
		};

		return playerDao.getByGuid(guid)
			.then(rejectPlayerNotFound)
			.then(getGame)
			.then(checkAlreadyPlaying)
	};

	api.place = function() {
		return Promise.reject('Invalid ship');
	};

	var initGame = function(guid) {
		return {
			player1: guid
		};
	};

	return api;
};

module.exports = Game;
