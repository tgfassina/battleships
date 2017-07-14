PlayerRoute = function(app, player) {

	app.post('/player/signup', function (req, res) {
		player.signUp(req.body.name).then(function(response) {
			res.send(response);
		}).catch(function(msg) {
			res.status(500).send(msg);
		});
	});
};

module.exports = PlayerRoute;
