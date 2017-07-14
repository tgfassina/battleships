var VictoryCondition = require('./victory-condition.js');

var Lobby = function(gameDao, playerDao) {

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
			return gameData;
		};

		var assertSlotIsAvailable = function(gameData) {
			if (gameData.player2) {
				return Promise.reject('Lobby is full');
			}
			return gameData;
		};

		var joinLobby = function(gameData) {
			gameData.player2 = guid;
			return gameDao.update(gameData._id, gameData).then(function() {
				return 'Lobby joined';
			});
		};

		return assertPlayerExists(guid)
			.then(getGame)
			.then(checkAlreadyPlaying)
			.then(assertSlotIsAvailable)
			.then(joinLobby);
	};

	api.status = function(gameId) {
		var getGame = function() {
			return gameDao.getById(gameId);
		};

		var getStatus = function(gameData) {
			var status = 'setup';
			var winner = null;

			if (gameData.ready.p1 && gameData.ready.p2) {
				status = 'playing';
			}

			var stats = VictoryCondition.run(gameData)
			if (stats.complete) {
				status = 'complete';
			};

			return {
				phase: status,
				stats: stats
			};
		};

		return getGame().then(getStatus);
	};

	var initGame = function(guid) {
		return {
			player1: guid,
			player2: null,
			ready: {
				p1: false,
				p2: false
			},
			board: {
				p1: {1: null, 2: null, 3: null, 4: null, 5: null},
				p2: {1: null, 2: null, 3: null, 4: null, 5: null}
			},
			moves: {
				p1: [],
				p2: []
			}
		};
	};

	var assertPlayerExists = function(guid) {
		var rejectNotFound = function(data) {
			if (!data) return Promise.reject('Player not found');
		};
		return playerDao.getByGuid(guid)
			.then(rejectNotFound);
	};

	return api;
};

module.exports = Lobby;
