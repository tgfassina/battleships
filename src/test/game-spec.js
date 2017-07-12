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
				expect(noGuid).to.eventually.be.rejectedWith('Failed to provide guid'),
				expect(invalidGuid).to.eventually.be.rejectedWith('Invalid guid')
			]);
		});

		it('should provide game id', function() {
			var promise = player.signUp('Jan').then(function(guid) {
				return game.create(guid).then(function(gameId) {
					return gameId.length;
				});
			});

			return expect(promise).to.eventually.equal(24);
		});
	});

	describe('join', function() {
		it('should require existing player guid', function() {
			var noGuid = game.join();
			var invalidGuid = game.join('0000');

			return Promise.all([
				expect(noGuid).to.eventually.be.rejectedWith('Failed to provide guid'),
				expect(invalidGuid).to.eventually.be.rejectedWith('Invalid guid')
			]);
		});

		it('should require a player who is not in game', function() {
			var promise = player.signUp('Jan').then(function(guid) {
				return game.create(guid).then(function(gameId) {
					return game.join(guid, gameId);
				});
			});

			return expect(promise)
				.to.eventually.be.rejectedWith('Already playing this game');
		});
	});
});
