describe('Game setup', function() {

	var Game = require('../models/game.js');
	var Player = require('../models/player.js');

	var Archetype = require('./artifacts/archetype.js');
	var gameDaoFake = require('./artifacts/game-dao-fake.js');
	var playerDaoFake = require('./artifacts/player-dao-fake.js');

	var archetype;
	var game;
	var player;

	beforeEach(function() {
		game = Game(gameDaoFake, playerDaoFake);
		player = Player(playerDaoFake);
		archetype = Archetype(player, game);
	});

	describe('place', function() {
		it('should validate ship type', function() {
			var ship1 = {ship: 0, x: 0, y: 0, r: 2};
			var ship2 = {ship: 6, x: 0, y: 0, r: 2};

			var placeShips = function(state) {
				return {
					p1: game.place(state.guidP1, state.gameId, ship1),
					p2: game.place(state.guidP1, state.gameId, ship2)
				};
			};

			var assert = function(placements) {
				return Promise.all([
					expect(placements.p1).to.be.rejectedWith('Invalid ship'),
					expect(placements.p2).to.be.rejectedWith('Invalid ship')
				]);
			};

			return archetype.forSinglePlayerLobby()
				.then(placeShips)
				.then(assert);
		});

		it('should not allow ships be placed on the same tile', function() {
			var _collision;

			var ship1 = {ship: 1, x: 0, y: 0, r: 2};
			var ship2 = {ship: 2, x: 0, y: 0, r: 2};

			var placeCarrier = function(state) {
				return game.place(state.guidP1, state.gameId, ship1).then(function() {
					return state;
				});
			};

			var placeBattleship = function(state) {
				_collision = game.place(state.guidP1, state.gameId, ship2);
			};

			var assert = function() {
				return expect(_collision)
					.to.be.rejectedWith('Ships cannot collide');
			};

			return archetype.forSinglePlayerLobby()
				.then(placeCarrier)
				.then(placeBattleship)
				.then(assert);
		});

		xit('should not be allowed after game started', function() {
			return archetype.forTwoPlayerLobby()
				.then(playersGetReady)
				.then(getReadyOnceMore)
				.then(assert);
		});

		it('should inform ship name when successfully placed', function() {
			var ship1 = {ship: 1, x: 0, y: 0, r: 2};
			var ship2 = {ship: 2, x: 0, y: 1, r: 2};
			var ship3 = {ship: 3, x: 0, y: 2, r: 2};
			var ship4 = {ship: 4, x: 0, y: 3, r: 2};
			var ship5 = {ship: 5, x: 0, y: 4, r: 2};

			var placeShips = function(state) {
				return {
					p1: game.place(state.guidP1, state.gameId, ship1),
					p2: game.place(state.guidP1, state.gameId, ship2),
					p3: game.place(state.guidP1, state.gameId, ship3),
					p4: game.place(state.guidP1, state.gameId, ship4),
					p5: game.place(state.guidP1, state.gameId, ship5)
				};
			};

			var assert = function(placements) {
				return Promise.all([
					expect(placements.p1).to.eventually.equal('Carrier'),
					expect(placements.p2).to.eventually.equal('Battleship'),
					expect(placements.p3).to.eventually.equal('Cruiser'),
					expect(placements.p4).to.eventually.equal('Submarine'),
					expect(placements.p5).to.eventually.equal('Destroyer')
				]);
			};

			return archetype.forSinglePlayerLobby()
				.then(placeShips)
				.then(assert);
		});
	});
});
