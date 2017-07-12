var _ = require('lodash');
var idGenerator = require('./id-generator.js');

var fake = {};

fake.data = [];

fake.save = function() {
	var data = {
		_id: idGenerator.get()
	};

	fake.data.push(data);

	return Promise.resolve(data);
};

fake.getById = function(id) {
	return Promise.reject('Game not found');
};

module.exports = fake;
