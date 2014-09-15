var fs = require('fs');

app.get('/api/logs', function(req, res) {
	fs.readFile(config.logFile, function(err, data) {
		if (err) return res.send(400, err);
		res.send('[' +
			data
				.toString()
				.replace(/\n/g, ',')
				.replace(/,$/,'')
				.replace(/\\u001b\[\d+m/g, '')
		+ ']');
	});
});
