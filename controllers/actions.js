app.get('/api/actions/takeoff/:id', function(req, res) {
	drone.disableEmergency();
	logger.log('Take off!');
	drone.takeoff(function() {
		logger.info('Take off confirmed');
		res.send(200);
	});
});

app.get('/api/actions/reset/:id', function(req, res) {
	drone.disableEmergency();
	res.send(200);
});

app.get('/api/actions/land/:id', function(req, res) {
	logger.log('Land!');
	drone.land(function() {
		logger.info('Landed');
		res.send(200);
	});
});

app.get('/api/actions/stop/:id', function(req, res) {
	logger.log('Stop!');
	drone.stop();
	res.send(200);
});

app.get('/api/actions/altitude/:id/:direction/:speed?', function(req, res) {
	var amount;
	if (req.params.direction == 'up') {
		amount = req.params.speed || config.drone.defaults.upSpeed;
		logger.info('Altitude up', amount);
		drone.up(amount);
		res.send(200);
	} else if (req.params.direction == 'down') {
		amount = req.params.speed || config.drone.defaults.downSpeed;
		logger.info('Altitude down', amount);
		drone.down(amount);
		res.send(200);
	} else {
		res.send(400, 'Unknown direction');
	}
});

app.get('/api/actions/move/:id/:direction/:speed?', function(req, res) {
	var amount;
	if (req.params.direction == 'forward') {
		amount = req.params.speed || config.drone.defaults.forwardSpeed;
		logger.info('Move Forward', amount);
		drone.front(amount);
		res.send(200);
	} else if (req.params.direction == 'backward') {
		amount = req.params.speed || config.drone.defaults.backwardSpeed;
		logger.info('Move Backward', amount);
		drone.back(amount);
		res.send(200);
	} else if (req.params.direction == 'left') {
		amount = req.params.speed || config.drone.defaults.leftSpeed;
		logger.info('Move Left', amount);
		drone.left(amount);
		res.send(200);
	} else if (req.params.direction == 'right') {
		amount = req.params.speed || config.drone.defaults.rightSpeed;
		logger.info('Move Right', amount);
		drone.right(amount);
		res.send(200);
	} else {
		res.send(400, 'Unknown direction');
	}
});

app.get('/api/actions/rotate/:id/:direction/:speed?', function(req, res) {
	if (req.params.direction == 'clockwise') {
		amount = req.params.speed || config.drone.defaults.clockwiseSpeed;
		logger.info('Rotate clockwise', amount);
		drone.clockwise(amount);
		res.send(200);
	} else if (req.params.direction == 'antiClockwise') {
		amount = req.params.speed || config.drone.defaults.antiClockwiseSpeed;
		logger.info('Rotate antiClockwise', amount);
		drone.counterClockwise(amount);
		res.send(200);
	} else {
		res.send(400, 'Unknown direction');
	}
});
