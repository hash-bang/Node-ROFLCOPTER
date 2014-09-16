var geoLocation = {};

app.get('/slave', function(req, res) {
	res.render('pages/slave');
});


app.get('/api/slave', function(req, res) {
	res.send(geoLocation);
});

app.post('/api/slave', function(req, res) {
	geoLocation = req.body;
	res.send(200);
});
