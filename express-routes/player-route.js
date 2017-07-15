PlayerRoute = function(app, player) {

	app.post('/player/signup', (req, res) => (
		player.signUp(req.body.name)
			.then((response) => res.send(response))
			.catch((msg) => res.status(500).send(msg))
	));
};

module.exports = PlayerRoute;
