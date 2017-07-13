var GameDao = function(mongoose) {

	var Schema = mongoose.Schema({
		player1: String,
		player2: String,
		board: Object
	});
	var Model = mongoose.model('game', Schema);


	var api = {};

	api.save = function(data) {
		var game = new Model(data);
		return game.save();
	};

	api.update = function(data) {
		return Model.findByIdAndUpdate(data._id, data);
	};

	api.getById = function(id) {
		var assertExists = function(data) {
			if (!data) return Promise.reject('Game not found');
			return data;
		};

		return Model.findById(id).then(assertExists);
	};

	return api;
};

module.exports = GameDao;
