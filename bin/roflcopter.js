#!/usr/bin/env node
# ROFLCopter Drone control
# @author Matt Carter <m@ttcarter.com>
# @url https://github.com/hash-bang/Node-ROFLCOPTER

var program = require('commander');
var arDrone = require('ar-drone');
var client  = arDrone.createClient({
	ip: '192.168.1.1'
});
console.log('ready');

program
	.version(require('../package').version)
	.option('-i, --ip [address]', 'IP address or hostname to connect to (default: "192.168.1.1")', '192.168.1.1')
	.parse(process.argv);

var joystick = new (require('joystick'))(0, 3500, 350);


var heightSpeed = 0.4;
var maxInt = 32768;

var minMax = function(value, min, max) {
	if (value < min) {
		value = min;
	} else if (value > max) {
		value = max;
	}
	return value;
}

joystick
	.on('button', function(data) {
		console.log(data);
		switch(data.number) {
			case 12: // Select
				if (data.value) {
					console.log('Trigger take off');
					client.takeoff(function() {
						console.log('Taken off');
					});
				}
				break;
			case 13: // Reset emergency
				if (data.value) {
					client.disableEmergency();
				}
			case 14: // Xbox logo
				if (data.value) {
					client.land();
				}
				break;
			case 11: // Right back shoulder
				if (data.value) {
					client.up(heightSpeed);
				} else {
					client.stop();
				}
				break;
			case 10: // Left back shoulder
				if (data.value) {
					client.down(heightSpeed);
				} else {
					client.stop();
				}
				break;
			case 7: // Y
				if (data.value) {
					console.log('ANIMATE');
					client.animate('phiDance', 1000);
				}
				break;
			case 4: // A
				if (data.value) {
					client.animate('flipAhead', 1000);
				}
				break;
			case 6: // X
				if (data.value) {
					client.animate('flipLeft', 250);
				}
				break;
			case 5: // B
				if (data.value) {
					client.animate('flipRight', 500);
				}
				break;
			case 15: // Joystick Left
			case 16: // Joystick Right
				if (data.value) {
					client.stop();
				}
		}
	})
	.on('axis', function(data) {
		var value;
		switch(data.number) {
			case 1: // Left up/down
			case 3: // Right up/down
				if (data.value < 0) {
					client.front(minMax(1 - ((0-data.value) / maxInt)), 0, maxInt);
				} else {
					client.back(minMax(data.value / maxInt, 0, maxInt));
				}
				break;
			case 0: // Left left/right
				if (data.value < 0) {
					client.counterClockwise(minMax(1 - ((0-data.value) / maxInt)), 0, maxInt);
				} else {
					client.clockwise(minMax(data.value / maxInt, 0, maxInt));
				}
				break;
			case 2: // Right left/right
				if (data.value < 0) {
					client.left(minMax(1 - ((0-data.value) / maxInt)), 0, maxInt);
				} else {
					client.right(minMax(data.value / maxInt, 0, maxInt));
				}
				break;
		}
	});
