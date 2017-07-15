GameRoute = function(app, game) {

	app.post('/game/place', (req, res) => (
		game.place(req.body.guid, req.body.gameId, req.body.placement)
			.then((response) => res.send(response))
			.catch((msg) => res.status(500).send(msg))
	));

	app.post('/game/ready', (req, res) => (
		game.ready(req.body.guid, req.body.gameId)
			.then((response) => res.send(response))
			.catch((msg) => res.status(500).send(msg))
	));

	app.post('/game/shoot', (req, res) => (
		game.shoot(req.body.guid, req.body.gameId, req.body.shot)
			.then((response) => res.send(response))
			.catch((msg) => res.status(500).send(msg))
	));
};

module.exports = GameRoute;
