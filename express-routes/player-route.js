PlayerRoute = function(app, playerDao) {

	var Player = require('../src/models/player.js');
	var player = Player(playerDao);

	app.post('/player/signup', function (req, res) {
		var token = player.signUp(req.body.name);

		res.send({
			token: token
		});
	});
};

module.exports = PlayerRoute;
