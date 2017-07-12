PlayerRoute = function(app, player) {

	app.post('/player/signup', function (req, res) {
		player.signUp(req.body.name).then(function(guid) {
			res.send({guid: guid});
		}).catch(function() {
			res.status(500).send('Nope!');
		});
	});
};

module.exports = PlayerRoute;
