describe('Player', function() {

	var Player = require('../models/player.js');
	var playerDaoFake = require('./artifacts/player-dao-fake.js');

	var player;

	beforeEach(function() {
		player = Player(playerDaoFake);
	});

	describe('signUp', function() {
		it('should require a name', function() {
			var badSignUp = player.signUp('');
			return expect(badSignUp).to.be.rejectedWith('Failed to provide name');
		});

		it('should provide guid', function() {
			var assert = function(response) {
				return expect(response.guid.length).to.equal(36);
			};

			return player.signUp('Jan').then(assert);
		});

		it('should provide a unique guid', function() {

			var playersSignUp = function() {
				return Promise.all([
					player.signUp('Jan'),
					player.signUp('Andy')
				]);
			};

			var assert = function(responses) {
				expect(responses[0].guid).to.not.equal(responses[1].guid);
			};

			return playersSignUp().then(assert);
		});
	});
});
