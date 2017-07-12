var Game = function(gameDao, playerDao) {

	var api = {};

	api.create = function(guid) {

		var createGame = function() {
			var gameData = initGame(guid);
			return gameDao.save(gameData);
		};

		var returnGameId = function(gameData) {
			return gameData['_id'];
		};

		return assertPlayer(guid)
			.then(createGame)
			.then(returnGameId);
	};

	api.join = function(guid, gameId) {

		var getGame = function() {
			return gameDao.getById(gameId);
		};

		var checkAlreadyPlaying = function(gameData) {
			if (gameData.player1 === guid) {
				return Promise.reject('Already playing this game');
			}
		};

		return assertPlayer(guid)
			.then(getGame)
			.then(checkAlreadyPlaying)
	};

	api.place = function() {
		return Promise.reject('Invalid ship');
	};

	api.ready = function() {
		return Promise.reject('Must place all ships');
	};

	var initGame = function(guid) {
		return {
			player1: guid
		};
	};

	var assertPlayer = function(guid) {
		var rejectNotFound = function(data) {
			if (!data) return Promise.reject('Player not found');
		};
		return playerDao.getByGuid(guid)
			.then(rejectNotFound);
	};

	return api;
};

module.exports = Game;
