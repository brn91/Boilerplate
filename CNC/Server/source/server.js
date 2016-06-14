var express = require('express');
var app     = express();
var router  = express.Router();
var cors    = require('cors');
var bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json()); 

var ROUTES  = ['status', 'tasks'];

if (ROUTES.length > 0) {

	ROUTES.forEach(function(route) {
		require(__dirname + '/routes/' + route)(router);
	});

}


app.use('/api', router);



module.exports = {

	listen: function(port) {

		port = typeof port === 'number' ? (port | 0) : null;


		if (port !== null) {

			app.listen(port);

			return true;

		} else {

			throw "listen(Number port): port is not a Number";

		}


		return false;

	}

};

