var _ = require('lodash');

/**
* Hash of objects to their geolocation info
* devices = [{
*	battery: int,
*	rotation: {x: int, y: int, z: int}, 
*	acceeleration: {x: int, y: int, z: int}, 
* }]
* @type object
*/
var devices = {};

app.get('/slave/:id', function(req, res) {
	res.render('pages/slave');
});

app.get('/api/device/:id', function(req, res) {
	res.send(devices[req.params.id] || {});
});

app.post('/api/device/:id', function(req, res) {
	var deviceInfo = req.body;
	deviceInfo.id = req.params.id;
	devices[req.params.id] = deviceInfo;
	res.send(200);
});

app.get('/api/device', function(req, res) {
	res.send(_.keys(devices));
});


var droneId = 'ardrone';

drone
	.on('hovering', function(data) {
		devices[droneId].state = 'hovering';
	})
	.on('flying', function(data) {
		devices[droneId].state = 'flying';
	})
	.on('landing', function(data) {
		devices[droneId].state = 'landing';
	})
	.on('batteryChange', function(data) {
		if (!devices[droneId])
			devices[droneId] = {id: droneId};
		devices[droneId].battery = data;
	})
	.on('altitudeChange', function(data) {
		console.log('onAltitudeChange'.underline.green, data);
	})
	.on('navdata', function(data) {
		if (!data.demo) // navdata update but no actual data supplied - ignore packet. This usually occurs when booting and the nav data hasn't yet been turned on
			return;
		if (!devices[droneId])
			devices[droneId] = {id: droneId};
		devices[droneId].battery = data.demo.batteryPercentage;
		devices[droneId].rotation = {x: data.demo.rotation.x, y: data.demo.rotation.y, z: data.demo.rotation.z};
		devices[droneId].acceleration = {x: data.demo.xVelocity, y: data.demo.yVelocity, z: data.demo.zVelocity};
	});
