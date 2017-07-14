LobbyRoute = function(app, lobby) {

	app.post('/lobby/create', function (req, res) {
		lobby.create(req.body.guid).then(function(gameId) {
			res.send({
				message: 'Lobby created',
				gameId: gameId
			});
		}).catch(function(msg) {
			res.status(500).send(msg);
		});
	});

	app.post('/lobby/join', function(req, res) {
		lobby.join(req.body.guid, req.body.gameId).then(function() {
			res.send({
				message: 'Lobby joined'
			});
		}).catch(function(msg) {
			res.status(500).send(msg);
		});
	});
};

module.exports = LobbyRoute;
