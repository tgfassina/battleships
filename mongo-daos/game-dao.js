var GameDao = function(mongoose) {

	var Schema = mongoose.Schema({
		player1: String,
		player2: String,
		ready: {
			p1: Boolean,
			p2: Boolean
		},
		board: {
			p1: Object,
			p2: Object
		},
		moves: {
			p1: Array,
			p2: Array
		}
	});
	var Model = mongoose.model('game', Schema);


	var api = {};

	api.save = function(data) {
		var game = new Model(data);
		return game.save();
	};

	api.update = function(id, data) {
		return Model.findByIdAndUpdate(id, data);
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
