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
};

module.exports = GameRoute;
