PlayerApi = function(app) {

	var Player = require('../models/player.js');
	var player = Player();

	app.post('/player/signup', function (req, res) {
		var token = player.signUp(req.body.name);

		res.send({
			token: token
		});
	});
};

module.exports = PlayerApi;
