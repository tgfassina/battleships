describe('Game', function() {

	var Game = require('../models/game.js');
	var Player = require('../models/player.js');

	var playerDaoFake = require('./fakes/player-dao-fake.js');

	var game;
	var player;

	beforeEach(function() {
		game = Game(playerDaoFake);
		player = Player(playerDaoFake);
	});

	describe('create', function() {
		it('should require existing player guid', function() {
			var noGuid = game.create();
			var invalidGuid = game.create('0000');

			return Promise.all([
				expect(noGuid).to.be.rejectedWith('Failed to provide guid'),
				expect(invalidGuid).to.be.rejectedWith('Invalid guid')
			]);
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
		it('should require existing player guid', function() {
			var noGuid = game.join();
			var invalidGuid = game.join('0000');

			return Promise.all([
				expect(noGuid).to.be.rejectedWith('Failed to provide guid'),
				expect(invalidGuid).to.be.rejectedWith('Invalid guid')
			]);
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
	});
});
