GameRoute = function(app, game) {

	app.post('/game/create', function (req, res) {
		game.create(req.body.guid).then(function(gameId) {
			res.send({gameId: gameId});
		}).catch(function() {
			res.status(500).send('Nope!');
		});
	});
};

module.exports = GameRoute;
