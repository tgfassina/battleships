var Archetype = function(player, game) {

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
		return game.create(state.guidP1).then(function(gameId) {
			state.gameId = gameId;
			return state;
		});
	};

	var joinGame = function(state) {
		return game.join(state.guidP2, state.gameId).then(function() {
			return state;
		});
	};

	api.forSinglePlayerLobby = function() {
		return signUpOne().then(createGame);
	};

	api.forTwoPlayersLobby = function() {
		return signUpTwo().then(createGame).then(joinGame);
	};

	return api;
};

module.exports = Archetype;
