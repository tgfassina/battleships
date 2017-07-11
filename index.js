var config = require('./config.js');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');


var mongoose = require('mongoose');
mongoose.connect(config.db.host, {
	useMongoClient: true
});


app.use(bodyParser.json())

var PlayerRoute = require('./express-routes/player-route.js');
var PlayerDao = require('./mongo-daos/player-dao.js');
PlayerRoute(app, PlayerDao(mongoose));


app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('You broke it!');
});


app.listen(3000, function () {
	console.log('Battleship operational!')
})
