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

		return assertPlayerExists(guid)
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

		return assertPlayerExists(guid)
			.then(getGame)
			.then(checkAlreadyPlaying)
	};

	api.place = function() {
		return Promise.reject('Invalid ship');
	};

	api.ready = function(guid, gameId) {

		var assertShipsArePlaced = function(gameData) {
			return Promise.reject('Must place all ships');
		};

		return assertPlayerInGame(guid, gameId)
			.then(assertShipsArePlaced);
	};

	api.shoot = function(guid, gameId) {
		var assertGameStarted = function() {
			return Promise.reject('Game not started yet');
		};

		return assertPlayerInGame(guid, gameId)
			.then(assertGameStarted);
	};


	var initGame = function(guid) {
		return {
			player1: guid
		};
	};

	var assertPlayerExists = function(guid) {
		var rejectNotFound = function(data) {
			if (!data) return Promise.reject('Player not found');
		};
		return playerDao.getByGuid(guid)
			.then(rejectNotFound);
	};

	var assertPlayerInGame = function(guid, gameId) {
		var assert = function(gameData) {
			var isPlayer1 = gameData.player1 === guid;
			var isPlayer2 = gameData.player2 === guid;

			if (!isPlayer1 && !isPlayer2) {
				return Promise.reject('Player is not in game');
			}

			return gameData;
		}

		return gameDao.getById(gameId).then(assert);
	};

	return api;
};

module.exports = Game;
