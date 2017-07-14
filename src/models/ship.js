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

module.exports = Ship;
