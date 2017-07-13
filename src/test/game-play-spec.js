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

	describe('shoot', function() {
		it('should assert game started', function() {
			var _shot;

			var signUp = function() {
				return player.signUp('Jan').then(function(guid) {
					return _guid = guid;
				});
			};

			var createGame = function(guid) {
				return game.create(guid);
			};

			var shoot = function(gameId) {
				_shot = game.shoot(_guid, gameId, 0, 0);
			};

			var assert = function() {
				return expect(_shot).to.be.rejectedWith('Game not started yet');
			};

			return signUp()
				.then(createGame)
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
					game.ready(state.guidJan),
					game.ready(state.guidAndy)
				]);
			};

			var missShot = function(state) {
				var shot = {x: 9, y: 9};
				_badShot = game.shoot(state.guidJan, state.gameId, shot);
			};

			var hitShot = function(state) {
				var shot = {x: 0, y: 0};
				_goodShot = game.shoot(state.guidAndy, state.gameId, shot);
			};

			var assert = function() {
				return Promise.all([
					expect(_badShot).to.equal({hit: false}),
					expect(_goodShot).to.equal({hit: true})
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
