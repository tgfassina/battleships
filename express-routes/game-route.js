GameRoute = function(app, game) {

	app.post('/game/place', function (req, res) {
		game.place(req.body.guid, req.body.gameId, req.body.placement)
			.then(function(shipName) {
				res.send({
					message: shipName+' placed'
				});
			})
			.catch(function(msg) {
				res.status(500).send(msg);
			});
	});

	app.post('/game/ready', function (req, res) {
		game.ready(req.body.guid, req.body.gameId)
			.then(function(shipName) {
				res.send({
					message: 'You are ready'
				});
			})
			.catch(function(msg) {
				res.status(500).send(msg);
			});
	});
};

module.exports = GameRoute;
