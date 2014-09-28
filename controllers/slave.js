var _ = require('lodash');

/**
* Hash of objects to their geolocation info
* @type object
*/
var geoLocation = {};

app.get('/slave/:id', function(req, res) {
	res.render('pages/slave');
});


app.get('/api/slave/:id', function(req, res) {
	res.send(geoLocation[req.params.id] || {});
});

app.post('/api/slave/:id', function(req, res) {
	geoLocation[req.params.id] = req.body;
	res.send(200);
});

app.get('/api/slaves', function(req, res) {
	res.send(_.keys(geoLocation));
});
