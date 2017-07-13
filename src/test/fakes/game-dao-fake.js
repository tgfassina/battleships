var _ = require('lodash');
var idGenerator = require('./id-generator.js');

var fake = {};

fake.data = {};

fake.save = function(data) {
	var newData = _.cloneDeep(data);
	var newId = idGenerator.get();

	newData._id = newId;
	fake.data[newId] = newData;
	return Promise.resolve(newData);
};

fake.update = function(id, data) {
	var newData = _.cloneDeep(data);
	fake.data[id] = newData;
	return Promise.resolve(newData);
};

fake.getById = function(id) {
	var game = fake.data[id];
	return game ?
		Promise.resolve(game) :
		Promise.reject('Game not found');
};

module.exports = fake;
