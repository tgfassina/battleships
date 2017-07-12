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

fake.findByGuid = function(guid) {
	var player = _.find(fake.data, function(p) {
		return p.guid === guid;
	});

	return Promise.resolve(player || null);
};

module.exports = fake;
