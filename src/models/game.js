_ = require('lodash');

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

	api.place = function(guid, gameId, ship) {

		var assertValidShip = function(gameData) {
			if (ship.ship < 1 || ship.ship > 5) {
				return Promise.reject('Invalid ship');
			}

			return gameData
		};

		var assertNoCollision = function(gameData) {
			var player = getPlayer(gameData, guid);

			var collision = false
			_.forEach(gameData.board[player], function(placedShip) {
				if (!placedShip) return;
				if (ship.x === placedShip.x && ship.y === placedShip.y) {
					collision = true;
				}
			});

			if (collision) {
				return Promise.reject('Ships cannot collide');
			}

			return gameData;
		};

		var placeShip = function(gameData) {
			var player = getPlayer(gameData, guid);

			gameData.board[player][ship.ship] = {
				x: ship.x,
				y: ship.y,
				r: ship.r
			};

			return gameDao.update(gameData._id, gameData);
		};

		var returnName = function() {
			var shipNames = [
				'',
				'Carrier',
				'Battleship',
				'Cruiser',
				'Submarine',
				'Destroyer'
			];
			return shipNames[ship.ship];
		};

		return assertPlayerInGame(guid, gameId)
			.then(assertValidShip)
			.then(assertNoCollision)
			.then(placeShip)
			.then(returnName);
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
			player1: guid,
			player2: null,
			board: {
				p1: {1: null, 2: null, 3: null, 4: null, 5: null},
				p2: {1: null, 2: null, 3: null, 4: null, 5: null}
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

	var getPlayer = function(gameData, guid) {
		if (gameData.player1 === guid) {
			return 'p1';
		}

		if (gameData.player2 === guid) {
			return 'p2';
		}

		return null;
	};

	return api;
};

module.exports = Game;
