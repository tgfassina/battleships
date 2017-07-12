var _ = require('lodash');

var fake = {};

fake.data = [];

fake.save = function(name, guid) {
	fake.data.push({
		name: name,
		guid: guid
	});

	return Promise.resolve({
		guid: guid
	});
};

fake.getByGuid = function(guid) {
	var player = _.find(fake.data, function(p) {
		return p.guid === guid;
	});

	return player ?
		Promise.resolve(player) :
		Promise.reject('Player not found');
};

module.exports = fake;
