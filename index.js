var config = require('./config.js');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json())

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.db.host, {
	useMongoClient: true
});


var PlayerDao = require('./mongo-daos/player-dao.js');
var Player = require('./src/models/player.js');
var playerDao = PlayerDao(mongoose);

var player = Player(playerDao);
var PlayerRoute = require('./express-routes/player-route.js');
PlayerRoute(app, player);

var Game = require('./src/models/game.js');
var game = Game(playerDao);
var GameRoute = require('./express-routes/game-route.js');
GameRoute(app, game);


app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('You broke it!');
});


app.listen(3000, function () {
	console.log('Battleship operational!')
})
