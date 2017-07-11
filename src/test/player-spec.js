describe('Player', function() {

	var Player = require('../models/player.js');
	var playerDaoFake = require('./fakes/player-dao-fake.js');

	var player;

	beforeEach(function() {
		player = Player(playerDaoFake);
	});

	describe('signUp', function() {

		it('should provide guid', function() {
			var guid = player.signUp('Jan');
			expect(guid.length).to.equal(36);
		});

		it('should provide a unique guid', function() {
			var guid1 = player.signUp('Jan');
			var guid2 = player.signUp('Andy');

			expect(guid1).to.not.equal(guid2);
		});

		it('should require a name', function() {
			var callNoArgs = player.signUp.bind(player);
			expect(callNoArgs).to.throw();

			var callEmptyName = player.signUp.bind(player, '');
			expect(callEmptyName).to.throw();
		});
	});
});
