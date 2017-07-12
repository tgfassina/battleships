var PlayerDao = function(mongoose) {

	var Schema = mongoose.Schema({
		name: String,
		guid: String
	});
	var Model = mongoose.model('player', Schema);


	var api = {};

	api.save = function(name, guid) {
		var player = new Model({
			name: name,
			guid: guid
		});

		return player.save();
	};

	api.getByGuid = function(guid) {
		var assertExists = function(data) {
			if (!data) return Promise.reject('Player not found');
			return data;
		};

		return Model.findOne({guid: guid}).then(assertExists);
	};

	return api;
};

module.exports = PlayerDao;
