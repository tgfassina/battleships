var _ = require('lodash');

describe('Game complete', function() {

	var Archetype = require('./artifacts/archetype.js');
	var archetype;
	var game;

	beforeEach(function() {
		archetype = Archetype();
		game = archetype.models.game;
	});

	var getCannon = function(guid, gameId) {
		return function(coords) {
			return game.shoot(guid, gameId, coords);
		};
	};

	it('should end with a victor', function() {
		var _lateP1;
		var _lateP2;


		var gameShots = function(state) {
			var recruitCannon = getCannon(state.guidP1, state.gameId);
			var generalCannon = getCannon(state.guidP2, state.gameId);

			var poorShots = [
				{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:3, y:0}, {x:4, y:0},
				{x:0, y:1}, {x:1, y:1}, {x:2, y:1}, {x:3, y:1}, {x:4, y:1},
				{x:0, y:2}, {x:1, y:2}, {x:2, y:2}, {x:3, y:2}, {x:4, y:2},
				{x:0, y:3}, {x:1, y:3}
			];

			var goodShots = [
				{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:3, y:0}, {x:4, y:0}, // Carrier
				{x:0, y:1}, {x:1, y:1}, {x:2, y:1}, {x:3, y:1}, // Battleship
				{x:0, y:2}, {x:1, y:2}, {x:2, y:2}, // Cruiser
				{x:0, y:3}, {x:1, y:3}, {x:2, y:3}, // Submarine
				{x:0, y:4}, {x:1, y:4} // Destroyer
			];

			var allShots = _.zip(poorShots, goodShots);

			var round = function(promise, shots) {
				var recruitMisses = function() {
					return recruitCannon(shots[0]);
				};

				var generalHits = function() {
					return generalCannon(shots[1]);
				};

				return promise.then(recruitMisses).then(generalHits);
			};

			var allMoves = _.reduce(allShots, round, Promise.resolve());

			return allMoves.then(function() {
				return state;
			});
		};

		var lateShots = function(state) {
			_lateP1 = game.shoot(state.guidP1, state.gameId, {x: 9, y: 9});
			_lateP2 = game.shoot(state.guidP2, state.gameId, {x: 9, y: 9});
		};

		var assert = function() {
			return Promise.all([
				expect(_lateP1).to.be.rejectedWith('Game is complete'),
				expect(_lateP2).to.be.rejectedWith('Game is complete')
			]);
		};

		return archetype.forTwoPlayersLobbyStarted()
			.then(gameShots)
			.then(lateShots)
			.then(assert);
	});
});
