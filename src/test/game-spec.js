describe('Game', function() {

	var Game = require('../models/game.js');

	var game;

	beforeEach(function() {
		game = Game();
	});

	describe('create', function() {
		it('should provide game id', function() {
			var gameId = game.create();
			expect(gameId.length).to.equal(24);
		});
	});
});
