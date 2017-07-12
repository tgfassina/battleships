describe('Game setup: placement phase', function() {

	var Game = require('../models/game.js');
	var Player = require('../models/player.js');

	var playerDaoFake = require('./fakes/player-dao-fake.js');

	var game;
	var player;

	beforeEach(function() {
		game = Game(playerDaoFake);
		player = Player(playerDaoFake);
	});

	describe('place', function() {
		it('should validate ship type', function() {

			var _gameId;
			var _guid;
			var _placement1;
			var _placement2;

			var position1 = {ship: 0, x: 0, y: 0, r: 1};
			var position2 = {ship: 6, x: 0, y: 0, r: 1};


			var signUp = function() {
				return player.signUp('Jan').then(function(guid) {
					return _guid = guid;
				});
			};

			var createGame = function(guid) {
				return game.create(guid).then(function(gameId) {
					return _gameId = gameId;
				});
			};

			var placeShips = function() {
				_placement1 = game.place(_guid, _gameId, position1);
				_placement2 = game.place(_guid, _gameId, position2);
			};

			var assert = function() {
				return Promise.all([
					expect(_placement1).to.be.rejectedWith('Invalid ship'),
					expect(_placement2).to.be.rejectedWith('Invalid ship')
				]);
			};

			return signUp()
				.then(createGame)
				.then(placeShips)
				.then(assert);
		});
	});
});
