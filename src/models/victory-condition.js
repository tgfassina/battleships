var _ = require('lodash');
var Ship = require('./ship.js');

var VictoryConditions = {};
VictoryConditions.run = function(gameData) {
	var p1Score = 0;
	var p2Score = 0;

	_.forEach(gameData.moves.p1, function(move) {
		_.forEach(gameData.board.p2, function(ship) {7
			if (Ship.occupiesTile(ship, move)) {
				p1Score++;
			}
		});
	});

	if (p1Score >= 17) {
		return {
			complete: true,
			winner: gameData.player1
		};
	}

	_.forEach(gameData.moves.p2, function(move) {
		_.forEach(gameData.board.p1, function(ship) {
			if (Ship.occupiesTile(ship, move)) {
				p2Score++;
			}
		});
	});

	if (p2Score >= 17) {
		return {
			complete: true,
			winner: gameData.player2
		};
	}

	return {complete: false};
};

module.exports = VictoryConditions;
