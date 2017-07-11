describe('Player', function() {

	var Player = require('../src/models/player.js');

	var player;

	beforeEach(function() {
		player = Player();
	});

	describe('signup', function() {

		it('should provide guid', function() {

			var identity = player.signUp();
			expect(identity.length).to.equal(36);
		});
	});
});
