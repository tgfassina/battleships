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

fake.updateAttribute = function(id, attribute, value) {
	_.set(fake.data[id], attribute, value);
	return Promise.resolve();
};

fake.getById = function(id) {
	var game = fake.data[id];
	return game ?
		Promise.resolve(game) :
		Promise.reject('Game not found');
};

module.exports = fake;
