GameRoute = function(app, game) {

	app.post('/game/create', function (req, res) {
		game.create(req.body.guid).then(function(gameId) {
			res.send({
				message: 'Game created',
				gameId: gameId
			});
		}).catch(function(msg) {
			res.status(500).send(msg);
		});
	});

	app.post('/game/join', function(req, res) {
		game.join(req.body.guid, req.body.gameId).then(function() {
			res.send({
				message: 'Joined game'
			});
		}).catch(function(msg) {
			res.status(500).send(msg);
		});
	});
};

module.exports = GameRoute;
