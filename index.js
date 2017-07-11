var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json())

var PlayerRoute = require('./routes/player.js');
PlayerRoute(app);


app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('You broke it!');
});


app.listen(3000, function () {
	console.log('Battleship operational!')
})
