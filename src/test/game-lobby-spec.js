describe('Game lobby', function() {

	var Archetype = require('./artifacts/archetype.js');
	var archetype;
	var player;
	var lobby;

	beforeEach(function() {
		archetype = Archetype();
		player = archetype.models.player;
		lobby = archetype.models.lobby;
	});

	describe('create', function() {
		it('should require existing player guid', function() {
			var badCreate = lobby.create('0000');
			expect(badCreate).to.be.rejectedWith('Player not found');
		});

		it('should provide game id', function() {

			var assert = function(state) {
				expect(state.gameId.length).to.equal(24);
			};

			return archetype.forSinglePlayerLobby().then(assert);
		});
	});

	describe('join', function() {
		it('should require existing game', function() {
			var _joinAttempt;

			var signUp = function() {
				return player.signUp('Jan');
			};

			var joinInexistingGame = function(guid) {
				_joinAttempt = lobby.join(guid, '0000');
			};

			var assert = function() {
				return expect(_joinAttempt).to.be.rejectedWith('Game not found');
			};

			return signUp()
				.then(joinInexistingGame)
				.then(assert);
		});

		it('should require a player who is not in game', function() {
			var _joinAttempt;

			var joinGame = function(state) {
				_joinAttempt = lobby.join(state.guidP1, state.gameId);
			};

			var assert = function() {
				return expect(_joinAttempt).to.be.rejectedWith('Already playing this game');
			};

			return archetype.forSinglePlayerLobby()
				.then(joinGame)
				.then(assert);
		});

		it('should require lobby to have an empty slot', function() {
			var _joinAttempt;

			var thirdPlayerSignsUp = function(state) {
				return player.signUp('Thiago').then(function(guid) {
					state.guidP3 = guid;
					return state;
				});
			};

			var thirdPlayerJoins = function(state) {
				_joinAttempt = lobby.join(state.guidP3, state.gameId);
			};

			var assert = function() {
				return expect(_joinAttempt).to.be.rejectedWith('Lobby is full');
			};

			return archetype.forTwoPlayersLobby()
				.then(thirdPlayerSignsUp)
				.then(thirdPlayerJoins)
				.then(assert);
		});
	});
});
