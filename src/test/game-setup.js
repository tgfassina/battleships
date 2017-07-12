describe('Game setup', function() {

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
	});
});
