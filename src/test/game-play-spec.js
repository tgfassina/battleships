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

		xit('should inform if it was hit or miss', function() {
			var _badShot;
			var _goodShot;

			var signUpPlayers = function() {
				return Promise.all([
					player.signUp('Jan'),
					player.signUp('Andy')
				]).then(function(guids) {
					return {
						guidJan: guids[0],
						guidAndy: guids[1]
					};
				});
			};

			var createGame = function(state) {
				return game.create(state.guidJan).then(function(gameId) {
					state.gameId = gameId
					return state;
				});
			};

			var joinGame = function(state) {
				return game.join(state.guidAndy, state.gameId).then(function() {
					return state;
				});
			};

			var placeInGame = function(guid, gameId) {
				return function(ship, x, y, r) {
					var position = {ship: ship, x: x, y: y, r: r};
					return game.place(guid, gameId, position);
				};
			};
			var placeShips = function(state) {
				var uiJan = placeInGame(state.guidJan, state.gameId);
				var uiAndy = placeInGame(state.guidAndy, state.gameId);

				return Promise.all([
					uiJan(1, 0, 0, 2),
					uiJan(2, 0, 1, 2),
					uiJan(3, 0, 2, 2),
					uiJan(4, 0, 3, 2),
					uiJan(5, 0, 4, 2),
					uiAndy(1, 0, 0, 2),
					uiAndy(2, 0, 1, 2),
					uiAndy(3, 0, 2, 2),
					uiAndy(4, 0, 3, 2),
					uiAndy(5, 0, 4, 2)
				]).then(function() {
					return state;
				});
			};

			var playersReady = function(state) {
				return Promise.all([
					game.ready(state.guidJan, state.gameId),
					game.ready(state.guidAndy, state.gameId)
				]).then(function() {
					return state;
				});
			};

			var missShot = function(state) {
				var shot = {x: 9, y: 9};
				_badShot = game.shoot(state.guidJan, state.gameId, shot);
				return state;
			};

			var hitShot = function(state) {
				var shot = {x: 0, y: 0};
				_goodShot = game.shoot(state.guidAndy, state.gameId, shot);
				return state;
			};

			var assert = function() {
				return Promise.all([
					expect(_badShot).to.eventually.equal({hit: false}),
					expect(_goodShot).to.eventually.equal({hit: true})
				]);
			};

			return signUpPlayers()
				.then(createGame)
				.then(joinGame)
				.then(placeShips)
				.then(playersReady)
				.then(missShot)
				.then(hitShot)
				.then(assert);
		});
	});
});
