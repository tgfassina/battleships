LobbyRoute = function(app, lobby) {

	app.post('/lobby/create', (req, res) => (
		lobby.create(req.body.guid)
			.then((response) => res.send(response))
			.catch((msg) => res.status(500).send(msg))
	));

	app.post('/lobby/join', (req, res) => (
		lobby.join(req.body.guid, req.body.gameId)
			.then((response) => res.send(response))
			.catch((msg) => res.status(500).send(msg))
	));

	app.get('/lobby/status/:gameId', (req, res) => (
		lobby.status(req.params.gameId)
			.then((response) => res.send(response))
			.catch((msg) => res.status(500).send(msg))
	));
};

module.exports = LobbyRoute;
