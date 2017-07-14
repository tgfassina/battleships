var Archetype = function(player, lobby, game) {

	var api = {};

	var signUpOne = function() {
		return player.signUp('Nameless').then(function(guid) {
			return {guidP1: guid}
		});
	};

	var signUpTwo = function() {
		return Promise.all([
			player.signUp('Jan'),
			player.signUp('Andy')
		]).then(function(guids) {
			return {
				guidP1: guids[0],
				guidP2: guids[1]
			};
		});
	};

	var createGame = function(state) {
		return lobby.create(state.guidP1).then(function(gameId) {
			state.gameId = gameId;
			return state;
		});
	};

	var joinGame = function(state) {
		return lobby.join(state.guidP2, state.gameId).then(function() {
			return state;
		});
	};

	var placeInGame = function(guid, gameId) {
		return function(ship, x, y, r) {
			var position = {ship: ship, x: x, y: y, r: r};
			return game.place(guid, gameId, position);
		};
	};
	var placeShips = function(state) {
		var uiP1 = placeInGame(state.guidP1, state.gameId);
		var uiP2 = placeInGame(state.guidP2, state.gameId);

		return Promise.all([
			uiP1(1, 0, 0, 2),
			uiP1(2, 0, 1, 2),
			uiP1(3, 0, 2, 2),
			uiP1(4, 0, 3, 2),
			uiP1(5, 0, 4, 2),
			uiP2(1, 0, 0, 2),
			uiP2(2, 0, 1, 2),
			uiP2(3, 0, 2, 2),
			uiP2(4, 0, 3, 2),
			uiP2(5, 0, 4, 2)
		]).then(function() {
			return state;
		});
	};

	var playersReady = function(state) {
		return Promise.all([
			game.ready(state.guidP1, state.gameId),
			game.ready(state.guidP2, state.gameId)
		]).then(function() {
			return state;
		});
	};


	api.forSinglePlayerLobby = function() {
		return signUpOne()
			.then(createGame);
	};

	api.forTwoPlayersLobby = function() {
		return signUpTwo()
			.then(createGame)
			.then(joinGame);
	};

	api.forTwoPlayersLobbyStarted = function() {
		return signUpTwo()
			.then(createGame)
			.then(joinGame)
			.then(placeShips)
			.then(playersReady);
	};

	return api;
};

module.exports = Archetype;
