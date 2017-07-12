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
			expect(game.create())
				.to.eventually.be.rejectedWith('Failed to provide guid');
			expect(game.create('0000'))
				.to.eventually.be.rejectedWith('Invalid guid');
		});

		it('should provide game id', function() {
			player.signUp('Jan').then(function(guid) {
				game.create(guid).then(function(gameId) {
					expect(gameId.length).to.equal(24);
				});
			});
		});
	});

	describe('join', function() {
		it('should require existing player guid', function() {
			expect(game.join())
				.to.eventually.be.rejectedWith('Failed to provide guid');
			expect(game.join('0000'))
				.to.eventually.be.rejectedWith('Invalid guid');
		});

		it('should require a player who is not in game', function() {
			var promise = player.signUp('Jan').then(function(guid) {
				return game.create(guid).then(function(gameId) {
					return game.join(guid, gameId);
				});
			});

			expect(promise).to.eventually.be.rejectedWith('Already playing this game');
		});
	});
});
