const VictoryCondition = require('./victory-condition.js');

const Lobby = function(gameDao, playerDao) {

	const api = {};

	api.create = function(guid) {

		const createGame = () => (gameDao.save(initGame(guid)));

		const response = (gameData) => ({
			message: 'Lobby created',
			gameId: gameData._id
		});

		return assertPlayerExists(guid)
			.then(createGame)
			.then(response);
	};

	api.join = function(guid, gameId) {

		const getGame = () => (gameDao.getById(gameId));

		const checkAlreadyPlaying = (gameData) => (
			gameData.player1 === guid ?
				Promise.reject('Already playing this game')
				:
				gameData
		);

		const assertSlotIsAvailable = (gameData) => (
			gameData.player2 ?
				Promise.reject('Lobby is full')
				:
				gameData
		);

		const joinLobby = (gameData) => (gameDao.updateAttribute(
			gameData._id,
			'player2',
			guid
		));

		const response = () => ({message: 'Lobby joined'});

		return assertPlayerExists(guid)
			.then(getGame)
			.then(checkAlreadyPlaying)
			.then(assertSlotIsAvailable)
			.then(joinLobby)
			.then(response);
	};

	api.status = function(gameId) {
		const getGame = function() {
			return gameDao.getById(gameId);
		};

		const getStatus = function(gameData) {
			var status = 'setup';
			var winner = null;

			if (gameData.ready.p1 && gameData.ready.p2) {
				status = 'playing';
			}

			const result = VictoryCondition.run(gameData)
			if (result.complete) {
				status = 'complete';
			};
			return {
				phase: status,
				score: {
					player1: result.p1Score,
					player2: result.p2Score
				},
				winner: result.winner
			};
		};

		const setWinnerName = function(status) {
			if (status.winner) {
				return playerDao.getByGuid(status.winner).then(function(data) {
					status.winner = data.name;
					return status;
				});
			}

			return status;
		};

		return getGame().then(getStatus).then(setWinnerName);
	};

	const initGame = (guid)  => ({
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
	});

	const _rejectNotFound = (data) => (
		data || Promise.reject('Player not found')
	);
	const assertPlayerExists = (guid) => (
		playerDao.getByGuid(guid).then(_rejectNotFound)
	);

	return api;
};

module.exports = Lobby;
