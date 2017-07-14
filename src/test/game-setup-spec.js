describe('Game setup', function() {

	var Archetype = require('./artifacts/archetype.js');
	var archetype;
	var player;
	var lobby;

	beforeEach(function() {
		archetype = Archetype();
		player = archetype.models.player;
		lobby = archetype.models.lobby;
		game = archetype.models.game;
	});

	describe('place', function() {
		it('should validate ship type', function() {

			var placeShips = function(state) {
				var ship1 = {ship: 0, x: 0, y: 0, r: 2};
				var ship2 = {ship: 6, x: 0, y: 0, r: 2};
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

		it('should not allow ships to be placed on the same tile', function() {
			var _collision;

			var placeCarrier = function(state) {
				var ship = {ship: 1, x: 0, y: 0, r: 2};
				return game.place(state.guidP1, state.gameId, ship).then(function() {
					return state;
				});
			};

			var placeBattleship = function(state) {
				var ship = {ship: 2, x: 0, y: 0, r: 2};
				_collision = game.place(state.guidP1, state.gameId, ship);
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

		xit('should not allow ships to be placed on ships tails', function() {
			var _collision;

			var placeCarrier = function(state) {
				var ship = {ship: 1, x: 0, y: 0, r: 2};
				return game.place(state.guidP1, state.gameId, ship).then(function() {
					return state;
				});
			};

			var placeBattleship = function(state) {
				var ship = {ship: 2, x: 1, y: 0, r: 2};
				_collision = game.place(state.guidP1, state.gameId, ship);
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

		it('should not be allowed after game started', function() {
			var _alreadyReady;

			var getReadyOnceMore = function(state) {
				_alreadyReady = game.ready(state.guidP2, state.gameId);
			};

			var assert = function() {
				return expect(_alreadyReady).to.be.rejectedWith('Game already started');
			};

			return archetype.forTwoPlayersLobbyStarted()
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

	describe('ready', function() {
		it('should require all ships to be placed', function() {
			var _readyAttempt;

			var readyUp = function(state) {
				_readyAttempt = game.ready(state.guidP1, state.gameId);
			};

			var assert = function() {
				return expect(_readyAttempt)
					.to.be.rejectedWith('Must place all ships');
			};

			return archetype.forSinglePlayerLobby()
				.then(readyUp)
				.then(assert);
		});

		it('should require the player to be in the game', function() {
			var _andysGuid;
			var _readyAttempt;

			var playersSignUp = function() {
				return Promise.all([
					player.signUp('Jan'),
					player.signUp('Andy')
				])
				.then(function(guids) {
					_andysGuid = guids[1];
					return guids[0];
				});
			};

			var janCreatesGame = function(jansGuid) {
				return lobby.create(jansGuid);
			};

			var andyGetsReady = function(gameId) {
				_readyAttempt = game.ready(_andysGuid, gameId);
			};

			var assert = function() {
				return expect(_readyAttempt)
					.to.be.rejectedWith('Player is not in game');
			};

			return playersSignUp()
				.then(janCreatesGame)
				.then(andyGetsReady)
				.then(assert);
		});
	});
});
