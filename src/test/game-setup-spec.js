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

	describe('place', function() {
		it('should validate ship type', function() {
			var position1 = {ship: 0, x: 0, y: 0, r: 1};
			var position2 = {ship: 6, x: 0, y: 0, r: 1};


			var signUp = function() {
				return player.signUp('Jan');
			};

			var createGame = function(guid) {
				return game.create(guid).then(function(gameId) {
					return {guid: guid, gameId: gameId};
				});
			};

			var placeShips = function(state) {
				return {
					p1: game.place(state.guid, state.gameId, position1),
					p2: game.place(state.guid, state.gameId, position2)
				};
			};

			var assert = function(placements) {
				return Promise.all([
					expect(placements.p1).to.be.rejectedWith('Invalid ship'),
					expect(placements.p2).to.be.rejectedWith('Invalid ship')
				]);
			};

			return signUp()
				.then(createGame)
				.then(placeShips)
				.then(assert);
		});
	});
});
