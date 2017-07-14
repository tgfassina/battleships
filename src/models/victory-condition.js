var _ = require('lodash');
var Ship = require('./ship.js');

var VictoryConditions = {};
VictoryConditions.run = function(gameData) {
	var r = {
		p1Score: 0,
		p2Score: 0,
		winner: null,
		complete: false
	};

	_.forEach(gameData.moves.p1, function(move) {
		_.forEach(gameData.board.p2, function(ship) {7
			if (Ship.occupiesTile(ship, move)) {
				r.p1Score++;
			}
		});
	});

	_.forEach(gameData.moves.p2, function(move) {
		_.forEach(gameData.board.p1, function(ship) {
			if (Ship.occupiesTile(ship, move)) {
				r.p2Score++;
			}
		});
	});

	if (r.p1Score >= 17) {
		r.winner = gameData.player1;
		r.complete = true;
	}
	if (r.p2Score >= 17) {
		r.winner = gameData.player1;
		r.complete = true;
	}

	return r;
};

module.exports = VictoryConditions;
