describe('Player', function() {

	var Player = require('../src/models/player.js');

	var player;

	beforeEach(function() {
		player = Player();
	});

	describe('signup', function() {

		it('should provide guid', function() {
			var guid = player.signUp();
			expect(guid.length).to.equal(36);
		});

		it('should provide a unique guid', function() {
			var guid1 = player.signUp();
			var guid2 = player.signUp();

			expect(guid1).to.not.equal(guid2);
		});
	});
});
