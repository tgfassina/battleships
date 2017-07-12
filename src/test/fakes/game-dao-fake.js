var _ = require('lodash');
var idGenerator = require('./id-generator.js');

var fake = {};

fake.data = [];

fake.save = function(data) {
	data._id = idGenerator.get();
	fake.data.push(data);
	return Promise.resolve(data);
};

fake.getById = function(id) {
	var game = _.find(fake.data, function(g) {
		return g._id === id;
	});

	return game ?
		Promise.resolve(game) :
		Promise.reject('Game not found');
};

module.exports = fake;
