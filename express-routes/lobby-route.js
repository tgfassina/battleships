LobbyRoute = function(app, lobby) {

	app.post('/lobby/create', function (req, res) {
		lobby.create(req.body.guid).then(function(response) {
			res.send(response);
		}).catch(function(msg) {
			res.status(500).send(msg);
		});
	});

	app.post('/lobby/join', function(req, res) {
		lobby.join(req.body.guid, req.body.gameId).then(function(response) {
			res.send(response);
		}).catch(function(msg) {
			res.status(500).send(msg);
		});
	});

	app.get('/lobby/status/:gameId', function(req, res) {
		lobby.status(req.params.gameId).then(function(response) {
			res.send(response);
		}).catch(function(msg) {
			res.status(500).send(msg);
		});
	});
};

module.exports = LobbyRoute;
