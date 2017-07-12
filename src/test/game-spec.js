describe('Game', function() {

	var Game = require('../models/game.js');
	var Player = require('../models/player.js');

	var gameDaoFake = require('./fakes/game-dao-fake.js');
	var playerDaoFake = require('./fakes/player-dao-fake.js');

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
	});
});
