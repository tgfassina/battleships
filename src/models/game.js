var _ = require('lodash');
var Ship = require('./ship.js');

var Game = function(gameDao, playerDao) {

	var api = {};

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
				if (Ship.hasCollision(placedShip, ship)) {
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
			gameData.board[player][ship.ship] = ship;
			return gameDao.update(gameData._id, gameData);
		};

		var returnName = function() {;
			return Ship.getName(ship);
		};

		return assertPlayerInGame(guid, gameId)
			.then(assertValidShip)
			.then(assertNoCollision)
			.then(placeShip)
			.then(returnName);
	};

	api.ready = function(guid, gameId) {

		var assertShipsArePlaced = function(gameData) {

			var reducer = function(carry, placement) {
				return placement && carry;
			};

			var player = getPlayer(gameData, guid);
			var allPlaced = _.reduce(gameData.board[player], reducer, true);

			if (!allPlaced) {
				return Promise.reject('Must place all ships');
			}

			return gameData;
		};

		var assertGameIsNotStarted = function(gameData) {
			if (gameData.ready.p1 && gameData.ready.p2) {
				return Promise.reject('Game already started');
			}
			return gameData;
		};

		var setAsReady = function(gameData) {
			var player = getPlayer(gameData, guid);
			gameData.ready[player] = true;
			return gameDao.update(gameData._id, gameData);
		};

		return assertPlayerInGame(guid, gameId)
			.then(assertShipsArePlaced)
			.then(assertGameIsNotStarted)
			.then(setAsReady);
	};

	api.shoot = function(guid, gameId, shot) {

		var assertPlayerTurn = function(gameData) {
			var moves = gameData.moves;
			var hasTheTurn = moves.p1.length > moves.p2.length ? 'p2' : 'p1';

			var player = getPlayer(gameData, guid);
			if (hasTheTurn != player) {
				return Promise.reject('Not your turn');
			}

			return gameData;
		};

		var saveShot = function(gameData) {
			var player = getPlayer(gameData, guid);
			gameData.moves[player].push(shot);
			return gameDao.update(gameData._id, gameData).then(function() {
				return gameData;
			});
		};

		var returnShotResult = function(gameData) {
			var hit = false;
			var enemy = getEnemy(gameData, guid);

			_.forEach(gameData.board[enemy], function(enemyShip) {
				if (Ship.occupiesTile(enemyShip, shot)) {
					hit = true;
				}
			});

			return hit ? 'Hit' : 'Miss';
		};

		return assertPlaying(guid, gameId)
			.then(assertPlayerTurn)
			.then(saveShot)
			.then(returnShotResult);
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

	var assertPlaying = function(guid, gameId) {
		var assertGameStarted = function(gameData) {
			if (!gameData.ready.p1 || !gameData.ready.p2) {
				return Promise.reject('Game not started yet');
			}
			return gameData;
		};

		return assertPlayerInGame(guid, gameId)
			.then(assertGameStarted);
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

	var getEnemy = function(gameData, guid) {
		if (gameData.player1 === guid) {
			return 'p2';
		}

		if (gameData.player2 === guid) {
			return 'p1';
		}

		return null;
	};

	return api;
};

module.exports = Game;
