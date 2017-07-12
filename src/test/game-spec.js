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
			expect(game.create()).to.eventually.be.rejected;
			expect(game.create('0000')).to.eventually.be.rejected;
		});

		it('should provide game id', function() {
			player.signUp('Jan').then(function(guid) {
				game.create(guid).then(function(gameId) {
					expect(gameId.length).to.equal(24);
				});
			});
		});
	});
});
