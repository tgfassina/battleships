describe('Game lobby', function() {

	var Game = require('../models/game.js');
	var Player = require('../models/player.js');

	var gameDaoFake = require('./artifacts/game-dao-fake.js');
	var playerDaoFake = require('./artifacts/player-dao-fake.js');

	var game;
	var player;

	beforeEach(function() {
		game = Game(gameDaoFake, playerDaoFake);
		player = Player(playerDaoFake);
	});

	describe('create', function() {
		it('should require existing player guid', function() {
			var badCreate = game.create('0000');
			expect(badCreate).to.be.rejectedWith('Player not found');
		});

		it('should provide game id', function() {
			var signUp = function() {
				return player.signUp('Jan');
			};

			var createGame = function(guid) {
				return game.create(guid);
			};

			var assert = function(gameId) {
				expect(gameId.length).to.equal(24);
			};

			return signUp().then(createGame).then(assert);
		});
	});

	describe('join', function() {
		it('should require existing game', function() {
			var _joinAttempt;

			var signUp = function() {
				return player.signUp('Jan');
			};

			var joinInexistingGame = function(guid) {
				_joinAttempt = game.join(guid, '0000');
			};

			var assert = function() {
				return expect(_joinAttempt).to.be.rejectedWith('Game not found');
			};

			return signUp()
				.then(joinInexistingGame)
				.then(assert);
		});

		it('should require a player who is not in game', function() {
			var _guid;
			var _joinAttempt;

			var signUp = function() {
				return player.signUp('Jan').then(function(guid) {
					return _guid = guid;
				});
			};

			var createGame = function(guid) {
				return game.create(guid);
			};

			var joinGame = function(gameId) {
				_joinAttempt = game.join(_guid, gameId);
			};

			var assert = function() {
				return expect(_joinAttempt).to.be.rejectedWith('Already playing this game');
			};

			return signUp()
				.then(createGame)
				.then(joinGame)
				.then(assert);
		});

		it('should require lobby to have an empty slot', function() {
			var _joinAttempt;

			var signUpPlayers = function() {
				return Promise.all([
					player.signUp('Jan'),
					player.signUp('Andy'),
					player.signUp('Thiago')
				]).then(function(guids) {
					return {
						guidJan: guids[0],
						guidAndy: guids[1],
						guidThiago: guids[2]
					};
				});
			};

			var janCreates = function(state) {
				return game.create(state.guidJan).then(function(gameId) {
					state.gameId = gameId;
					return state;
				});
			};

			var andyJoins = function(state) {
				return game.join(state.guidAndy, state.gameId).then(function() {
					return state;
				});
			};

			var thiagoJoins = function(state) {
				_joinAttempt = game.join(state.guidThiago, state.gameId);
			};

			var assert = function() {
				return expect(_joinAttempt).to.be.rejectedWith('Lobby is full');
			};

			return signUpPlayers()
				.then(janCreates)
				.then(andyJoins)
				.then(thiagoJoins)
				.then(assert);
		});
	});

	describe('ready', function() {
		it('should require all ships to be placed', function() {
			var _guid;
			var _readyAttempt;

			var signUp = function() {
				return player.signUp('Jan').then(function(guid) {
					return _guid = guid;
				});
			};

			var createGame = function(guid) {
				return game.create(guid);
			};

			var readyUp = function(gameId) {
				_readyAttempt = game.ready(_guid, gameId);
			};

			var assert = function() {
				return expect(_readyAttempt)
					.to.be.rejectedWith('Must place all ships');
			};

			return signUp()
				.then(createGame)
				.then(readyUp)
				.then(assert);
		});

		it('should require the player to be in the game', function() {
			var _andysGuid;
			var _readyAttempt;

			var playersSignUp = function() {
				return Promise.all([
					player.signUp('Jan'),
					player.signUp('Andy')
				])
				.then(function(guids) {
					_andysGuid = guids[1];
					return guids[0];
				});
			};

			var janCreatesGame = function(jansGuid) {
				return game.create(jansGuid);
			};

			var andyGetsReady = function(gameId) {
				_readyAttempt = game.ready(_andysGuid, gameId);
			};

			var assert = function() {
				return expect(_readyAttempt)
					.to.be.rejectedWith('Player is not in game');
			};

			return playersSignUp()
				.then(janCreatesGame)
				.then(andyGetsReady)
				.then(assert);
		});
	});
});
