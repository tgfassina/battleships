GameRoute = function(app, game) {

	app.post('/game/place', function (req, res) {
		game.place(req.body.guid, req.body.gameId, req.body.placement)
			.then(function(response) {
				res.send(response);
			})
			.catch(function(msg) {
				res.status(500).send(msg);
			});
	});

	app.post('/game/ready', function (req, res) {
		game.ready(req.body.guid, req.body.gameId)
			.then(function(response) {
				res.send(response);
			})
			.catch(function(msg) {
				res.status(500).send(msg);
			});
	});

	app.post('/game/shoot', function (req, res) {
		game.shoot(req.body.guid, req.body.gameId, req.body.shot)
			.then(function(response) {
				res.send(response);
			})
			.catch(function(msg) {
				res.status(500).send(msg);
			});
	});
};

module.exports = GameRoute;
