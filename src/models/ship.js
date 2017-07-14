var _ = require('lodash');
var Ship = {};

var shipData = {
	1: {size: 5, name: 'Carrier'},
	2: {size: 4, name: 'Battleship'},
	3: {size: 3, name: 'Cruiser'},
	4: {size: 3, name: 'Submarine'},
	5: {size: 2, name: 'Destroyer'}
};

Ship.getName = function(ship) {
	return shipData[ship.ship].name;
};

Ship.isWithinBoard = function(ship) {
	var shipTiles = getShipTiles(ship);
	var reducer = function(carry, tile) {
		var isOut = tile.x < 0 || tile.x > 9 || tile.y < 0 || tile.y > 9;
		return carry && !isOut;
	};

	return _.reduce(shipTiles, reducer, true);
};

Ship.occupiesTile = function(ship, tile) {
	var compareTile = function(candidate) {
		return candidate.x === tile.x && candidate.y === tile.y;
	};

	return _.find(getShipTiles(ship), compareTile) ? true : false;
};

Ship.hasCollision = function(ship1, ship2) {
	if (!ship1 || !ship2) {
		return false;
	}

	if (ship1.ship === ship2.ship) {
		return false;
	}

	var reducer = function(hasCollision, ship1Tile) {
		return hasCollision || Ship.occupiesTile(ship2, ship1Tile);
	};

	return _.reduce(getShipTiles(ship1), reducer, false);
};

var getShipTiles = function(ship) {
	var tiles = [];
	var shipSize = shipData[ship.ship].size;
	for (var i = 0; i < shipSize; i++) {
		var tile = {x: ship.x, y: ship.y};

		if (ship.r === 1) {
			tile.y -= i;
		}
		if (ship.r === 2) {
			tile.x += i;
		}
		if (ship.r === 3) {
			tile.y += i;
		}
		if (ship.r === 4) {
			tile.x -= i;
		}

		tiles.push(tile);
	}

	return tiles;
};

module.exports = Ship;
