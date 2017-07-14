describe('Gameplay', function() {

	var Player = require('../models/player.js');
	var Lobby = require('../models/lobby.js');
	var Game = require('../models/game.js');

	var Archetype = require('./artifacts/archetype.js');
	var gameDaoFake = require('./artifacts/game-dao-fake.js');
	var playerDaoFake = require('./artifacts/player-dao-fake.js');

	var archetype;
	var player;
	var lobby;
	var game;

	beforeEach(function() {
		player = Player(playerDaoFake);
		lobby = Lobby(gameDaoFake, playerDaoFake);
		game = Game(gameDaoFake, playerDaoFake);
		archetype = Archetype(player, lobby, game);
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

		it('should enforce player1 makes the first move', function() {
			var _fail;

			var p2Shoots = function(state) {
				var shot = {x: 0, y: 0};
				_fail = game.shoot(state.guidP2, state.gameId, shot);
			};

			var assert = function() {
				return expect(_fail).to.be.rejectedWith('Not your turn');
			};

			return archetype.forTwoPlayersLobbyStarted()
				.then(p2Shoots)
				.then(assert);
		});

		it('should be on players turn', function() {
			var _p1Fail;
			var _p2Fail;

			var p1Shoots = function(state) {
				var shot = {x: 0, y: 0};
				return game.shoot(state.guidP1, state.gameId, shot).then(function() {
					return state;
				});
			};

			var p1Fails = function(state) {
				var shot = {x: 0, y: 0};
				_p1Fail = game.shoot(state.guidP1, state.gameId, shot);
				return state
			};

			var p2Shoots = function(state) {
				var shot = {x: 1, y: 0};
				return game.shoot(state.guidP2, state.gameId, shot).then(function() {
					return state;
				});
			};

			var p2Fails = function(state) {
				var shot = {x: 1, y: 0};
				_p2Fail = game.shoot(state.guidP2, state.gameId, shot);
				return state
			};

			var assert = function() {
				return Promise.all([
					expect(_p1Fail).to.be.rejectedWith('Not your turn'),
					expect(_p2Fail).to.be.rejectedWith('Not your turn')
				]);
			};

			return archetype.forTwoPlayersLobbyStarted()
				.then(p1Shoots)
				.then(p1Fails)
				.then(p2Shoots)
				.then(p2Fails)
				.then(assert);
		});

		it('should inform if it was hit or miss', function() {
			var _state;
			var saveState = function(state) {
				_state = state;
			};

			var missShot = function() {
				var shot = {x: 9, y: 9};
				return game.shoot(_state.guidP1, _state.gameId, shot);
			};

			var assertMiss = function(result) {
				return expect(result).to.equal('Miss');
			};

			var hitShot = function() {
				var shot = {x: 0, y: 0};
				return game.shoot(_state.guidP2, _state.gameId, shot);
			};

			var assertHit = function(result) {
				return expect(result).to.equal('Hit');
			};

			return archetype.forTwoPlayersLobbyStarted()
				.then(saveState)
				.then(missShot)
				.then(assertMiss)
				.then(hitShot)
				.then(assertHit);
		});
	});
});
