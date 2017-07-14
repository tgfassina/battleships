// Load config files
var config = require('./config.js');

// Boot Express
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json())

// Boot Mongoose
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.db.host, {
	useMongoClient: true
});


// Boot DAOs
var PlayerDao = require('./mongo-daos/player-dao.js');
var playerDao = PlayerDao(mongoose);

var GameDao = require('./mongo-daos/game-dao.js');
var gameDao = GameDao(mongoose);


// Boot models
var Player = require('./src/models/player.js');
var player = Player(playerDao);

var Game = require('./src/models/game.js');
var game = Game(gameDao, playerDao);

var Lobby = require('./src/models/lobby.js');
var lobby = Lobby(gameDao, playerDao);


// Boot routes
var PlayerRoute = require('./express-routes/player-route.js');
PlayerRoute(app, player);

var LobbyRoute = require('./express-routes/lobby-route.js');
LobbyRoute(app, lobby);

var GameRoute = require('./express-routes/game-route.js');
GameRoute(app, game);


// Boot webserver
app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('You broke it!');
});
app.listen(3000, function () {
	console.log('Battleship operational!')
})
