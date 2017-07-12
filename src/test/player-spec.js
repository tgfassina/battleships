describe('Player', function() {

	var Player = require('../models/player.js');
	var playerDaoFake = require('./fakes/player-dao-fake.js');

	var player;

	beforeEach(function() {
		player = Player(playerDaoFake);
	});

	describe('signUp', function() {
		it('should require a name', function() {
			var noName = player.signUp();
			var emptyName = player.signUp('');

			return Promise.all([
				expect(noName).to.eventually.be.rejectedWith('Failed to provide name'),
				expect(emptyName).to.eventually.be.rejectedWith('Failed to provide name')
			]);
		});

		it('should provide guid', function() {
			var promise = player.signUp('Jan').then(function (guid) {
				return guid.length;
			});

			return expect(promise).to.eventually.equal(36);
		});

		it('should provide a unique guid', function() {
			var diff = Promise.all([
				player.signUp('Jan'),
				player.signUp('Andy')
			]).then(function(results) {
				return results[0] === results[1];
			});

			return expect(diff).to.eventually.equal(false);
		});
	});
});
