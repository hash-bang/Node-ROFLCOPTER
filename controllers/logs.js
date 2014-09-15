app.get('/api/logs', function(req, res) {
	res.send([{
		date: new Date(),
		text: 'Hello world'
	}]);
});
