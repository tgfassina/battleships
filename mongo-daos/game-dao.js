var GameDao = function(mongoose) {

	var Schema = mongoose.Schema({
	});
	var Model = mongoose.model('game', Schema);


	var api = {};

	api.save = function() {
		var game = new Model({});

		return game.save();
	};

	api.getById = function(id) {
		var assertExists = function(data) {
			if (!data) return Promise.reject('Game not found');

			return Promise.reject('Game not found');
		};

		return Model.findById(id).then(assertExists);
	};

	return api;
};

module.exports = GameDao;
