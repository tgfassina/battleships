var Archetype = function(player, game) {

	var api = {};

	var signUpOne = function() {
		return player.signUp('Nameless').then(function(guid) {
			return {guidP1: guid}
		});
	};

	var createGame = function(state) {
		return game.create(state.guidP1).then(function(gameId) {
			state.gameId = gameId;
			return state;
		});
	};

	api.forSinglePlayerLobby = function() {
		return signUpOne().then(createGame);
	};

	return api;
};

module.exports = Archetype;
