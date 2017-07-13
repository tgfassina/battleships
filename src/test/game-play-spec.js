describe('Gameplay', function() {

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

	describe('shoot', function() {
		it('should assert game started', function() {
			var _shot;

			var shoot = function(state) {
				_shot = game.shoot(state.guidP1, state.gameId, 0, 0);
			};

			var assert = function() {
				return expect(_shot).to.be.rejectedWith('Game not started yet');
			};

			return archetype.forSinglePlayerLobby()
				.then(shoot)
				.then(assert);
		});

		it('should inform if it was hit or miss', function() {
			var _badShot;
			var _goodShot;

			var missShot = function(state) {
				var shot = {x: 9, y: 9};
				_badShot = game.shoot(state.guidP1, state.gameId, shot);
				return state;
			};

			var hitShot = function(state) {
				var shot = {x: 0, y: 0};
				_goodShot = game.shoot(state.guidP2, state.gameId, shot);
				return state;
			};

			var assert = function() {
				return Promise.all([
					expect(_badShot).to.eventually.equal(false),
					expect(_goodShot).to.eventually.equal(true)
				]);
			};

			return archetype.forTwoPlayersLobbyStarted()
				.then(missShot)
				.then(hitShot)
				.then(assert);
		});
	});
});
