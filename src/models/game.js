var Game = function() {

	var api = {};

	api.create = function() {
		return '0123456789'+'0123456789'+'0123';
	};

	return api;
};

module.exports = Game;
