const _ = require('lodash');
const Ship = require('./ship.js');
const VictoryCondition = require('./victory-condition.js');

const Game = function(gameDao, playerDao) {

	const api = {};

	api.place = function(guid, gameId, ship) {
		const _getPlayer = (gameData) => (getPlayer(gameData, guid));

		const assertValidShip = (gameData) => (
			(ship.ship < 1 || ship.ship > 5) ?
				Promise.reject('Invalid ship')
				:
				gameData
		);

		const assertWithinBoard = (gameData) => (
			!Ship.isWithinBoard(ship) ?
				Promise.reject('Must place ship within board')
				:
				gameData
		);

		const _reducer = (collision, placedShip) => (
			collision || Ship.hasCollision(placedShip, ship)
		);
		const assertNoCollision = (gameData) => (
			_.reduce(gameData.board[_getPlayer(gameData)], _reducer, false) ?
				Promise.reject('Ships cannot collide')
				:
				gameData
		);

		const placeShip = (gameData) => (
			gameDao.updateAttribute(
				gameData._id,
				['board', _getPlayer(gameData), ship.ship].join('.'),
				ship
			)
		);

		const response = () => ({message: Ship.getName(ship)+' is placed'});

		return gameWithPlayerOnSetup(guid, gameId)
			.then(assertValidShip)
			.then(assertWithinBoard)
			.then(assertNoCollision)
			.then(placeShip)
			.then(response);
	};

	api.ready = function(guid, gameId) {
		const _getPlayer = (gameData) => (getPlayer(gameData, guid));

		const _reducer = (carry, placement) => (carry || !placement);
		const assertNoShipsRemaining = (gameData) => (
			_.reduce(gameData.board[_getPlayer(gameData)], _reducer, false) ?
				Promise.reject('Must place all ships')
				:
				gameData
		);

		const setAsReady = (gameData) => (
			gameDao.updateAttribute(
				gameData._id,
				['ready', _getPlayer(gameData)].join('.'),
				true
			)
		);

		const response = () => ({message: 'You are ready'});

		return gameWithPlayerOnSetup(guid, gameId)
			.then(assertNoShipsRemaining)
			.then(setAsReady)
			.then(response);
	};

	api.shoot = function(guid, gameId, shot) {
		const _getPlayer = (gameData) => (getPlayer(gameData, guid));
		const _getEnemy = (gameData) => (getEnemy(gameData, guid));

		const assertGameNotOver = (gameData) => (
			VictoryCondition.run(gameData).complete ?
				Promise.reject('Game is complete')
				:
				gameData
		);

		const _hasTheTurn = (moves) => (
			(moves.p1.length > moves.p2.length) ? 'p2' : 'p1'
		);
		const assertPlayerTurn = (gameData) => (
			(_hasTheTurn(gameData.moves) != _getPlayer(gameData)) ?
				Promise.reject('Not your turn')
				:
				gameData
		);

		const assertWithinBoard = (gameData) => (
			(shot.x < 0 || shot.x > 9 || shot.y < 0 || shot.y > 9) ?
				Promise.reject('Must shoot within board')
				:
				gameData
		);

		const _reducer = (carry, move) => (
			(shot.x === move.x && shot.y === move.y) || carry
		);
		const assertNotDuplicated = (gameData) => (
			_.reduce(gameData.moves[_getPlayer(gameData)], _reducer, false) ?
				Promise.reject('Duplicated shot')
				:
				gameData
		);

		const saveShot = (gameData) => (
			gameDao.updateAttribute(
				gameData._id,
				['moves', _getPlayer(gameData)].join('.'),
				gameData.moves[_getPlayer(gameData)].concat(shot)
			).then(() => (gameData))
		);

		const _hitReducer = (hit, enemyShip) => (
			hit || Ship.occupiesTile(enemyShip, shot)
		);
		const response = (gameData) => (
			_.reduce(gameData.board[_getEnemy(gameData)], _hitReducer, false) ?
				{message: 'Hit'}
				:
				{message: 'Miss'}
		);

		return gameWithPlayerAndStarted(guid, gameId)
			.then(assertGameNotOver)
			.then(assertPlayerTurn)
			.then(assertWithinBoard)
			.then(assertNotDuplicated)
			.then(saveShot)
			.then(response);
	};


	const _assertInGame = (gameData, guid) => (
		(gameData.player1 != guid && gameData.player2 != guid) ?
			Promise.reject('Player is not in game')
			:
			gameData
	);
	const gameWithPlayer = (guid, gameId) => (
		gameDao.getById(gameId).then(gameData => _assertInGame(gameData, guid))
	);

	const _assertOnSetup = (gameData) => (
		(gameData.ready.p1 && gameData.ready.p2) ?
			Promise.reject('Game already started')
			:
			gameData
	);
	const gameWithPlayerOnSetup = (guid, gameId) => (
		gameWithPlayer(guid, gameId).then(_assertOnSetup)
	);

	const _assertStarted = (gameData) => (
		(!gameData.ready.p1 || !gameData.ready.p2) ?
			Promise.reject('Game not started yet')
			:
			gameData
	);
	const gameWithPlayerAndStarted = (guid, gameId) => (
		gameWithPlayer(guid, gameId).then(_assertStarted)
	);


	const getPlayer = (gameData, guid) => (
		(gameData.player1 === guid) ? 'p1' : 'p2'
	);

	const getEnemy = (gameData, guid) => (
		(gameData.player1 === guid) ? 'p2' : 'p1'
	);

	return api;
};

module.exports = Game;
