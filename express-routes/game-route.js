GameRoute = function(app, game) {

	app.post('/game/create', function (req, res) {
		game.create(req.body.guid).then(function(gameId) {
			res.send({gameId: gameId});
		}).catch(function(msg) {
			res.status(500).send(msg);
		});
	});
};

module.exports = GameRoute;
