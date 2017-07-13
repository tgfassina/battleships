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

	describe('shoot', function() {
		it('should assert game started', function() {
			var _shot;

			var signUp = function() {
				return player.signUp('Jan').then(function(guid) {
					return _guid = guid;
				});
			};

			var createGame = function(guid) {
				return game.create(guid);
			};

			var shoot = function(gameId) {
				_shot = game.shoot(_guid, gameId, 0, 0);
			};

			var assert = function() {
				expect(_shot).to.be.rejectedWith('Game not started yet');
			};

			return signUp()
				.then(createGame)
				.then(shoot)
				.then(assert);
		});
	});
});
