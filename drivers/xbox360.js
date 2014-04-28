var colors = require('colors');

var minMax = function(value, min, max) {
	if (value < min) {
		value = min;
	} else if (value > max) {
		value = max;
	}
	return value;
}

var joystick;

module.exports = {
	client: null,

	prepare: function() {
		console.log('Attaching joystick...'.blue);
		try {
			joystick = new (require('joystick'))(0, 3500, 350);
			return 1;
		} catch(e) {
			console.log('ERROR!'.bold.red, 'Cannot find usable joystick');
			return;
		}
	},

	listen: function() {
		joystick
			.on('button', function(data) {
				if (!listen)
					return;
				switch(data.number) {
					// D-Pad {{{
					case 0: // D-Pad Up
						if (data.value) {
							clearTimeout(dPadYTimer);
							dPadYFunc = function() {
								if (!dPadYFunc)
									return;
								client.front(buttonSpeedY);
								setTimeout(dPadYFunc, buttonRepeatY);
							};
							dPadYTimer = setTimeout(dPadYFunc, buttonRepeatY);
							console.log('Status'.green, 'Begin move forward');
						} else {
							console.log('Status'.green, 'Stop move forward');
							dPadYFunc = null;
							clearTimeout(dPadYTimer);
							client.stop();
						}
						break;
					case 1: // D-Pad Down
						if (data.value) {
							clearTimeout(dPadYTimer);
							dPadYFunc = function() {
								if (!dPadYFunc)
									return;
								client.back(buttonSpeedY);
								setTimeout(dPadYFunc, buttonRepeatY);
							};
							dPadYTimer = setTimeout(dPadYFunc, buttonRepeatY);
							console.log('Status'.green, 'Begin move backwards');
						} else {
							console.log('Status'.green, 'Stop move backwards');
							dPadYFunc = null;
							clearTimeout(dPadYTimer);
							client.stop();
						}
						break;
					case 2: // D-Pad Left
						if (data.value) {
							clearTimeout(dPadXTimer);
							dPadXFunc = function() {
								if (!dPadXFunc)
									return;
								client.counterClockwise(buttonSpeedX);
								setTimeout(dPadXFunc, buttonRepeatX);
							};
							dPadXTimer = setTimeout(dPadXFunc, buttonRepeatX);
							console.log('Status'.green, 'Begin rotate Counter-clockwise');
						} else {
							console.log('Status'.green, 'Stop rotate Counter-clockwise');
							dPadXFunc = null;
							clearTimeout(dPadXTimer);
							client.stop();
						}
						break;
					case 3: // D-Pad Right
						if (data.value) {
							clearTimeout(dPadXTimer);
							dPadXFunc = function() {
								if (!dPadXFunc)
									return;
								client.clockwise(buttonSpeedX);
								setTimeout(dPadXFunc, buttonRepeatX);
							};
							dPadXTimer = setTimeout(dPadXFunc, buttonRepeatX);
							console.log('Status'.green, 'Begin rotate Clockwise');
						} else {
							console.log('Status'.green, 'Stop rotate Clockwise');
							dPadXFunc = null;
							clearTimeout(dPadXTimer);
							client.stop();
						}
						break;
					// }}}
					case 12: // Select
						if (data.value) {
							console.log('Status'.bold.green, 'Emergency Disabled');
							client.disableEmergency();
						}
						break;
					case 13: // Start button
						if (data.value) {
							client.disableEmergency();
							console.log('Status'.bold.green, 'Take off!');
							client.takeoff(function() {
								console.log('Status'.bold.green, 'Take off confirm');
							});
						}
						break;
					case 14: // Xbox logo
						if (data.value) {
							console.log('Status'.bold.green, 'Land');
							client.land();
						}
						break;
					case 11: // Right back shoulder
						if (data.value) {
							console.log('Altitude'.magenta, '+' + heightSpeed);
							client.up(heightSpeed);
						} else {
							client.stop();
						}
						break;
					case 10: // Left back shoulder
						if (data.value) {
							console.log('Altitude'.magenta, '-' + heightSpeed);
							client.down(heightSpeed);
						} else {
							client.stop();
						}
						break;
					case 7: // Y
						if (data.value) {
							console.log('Animate'.bold.yellow, 'flipAhead');
							client.animate('flipAhead', 250);
						}
						break;
					case 4: // A
						if (data.value) {
							console.log('Animate'.bold.yellow, 'vzDance');
							client.animate('vzDance', 250);
						}
						break;
					case 6: // X
						if (data.value) {
							console.log('Animate'.bold.yellow, 'flipLeft');
							client.animate('flipLeft', 250);
						}
						break;
					case 5: // B
						if (data.value) {
							console.log('Animate'.bold.yellow, 'flipRight');
							client.animate('flipRight', 250);
						}
						break;
					case 15: // Joystick Left
					case 16: // Joystick Right
						console.log('Status'.bold.red, 'Stop');
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
						if (data.value > 0-deadZone && data.value < deadZone) {
							client.stop();	
						} else if (data.value < 0) {
							client.front(minMax(1 - ((0-data.value) / maxInt)), 0, maxInt);
						} else {
							client.back(minMax(data.value / maxInt, 0, maxInt));
						}
						break;
					case 0: // Left left/right
						if (data.value > 0-deadZone && data.value < deadZone) {
							client.stop();	
						} else if (data.value < 0) {
							client.counterClockwise(minMax(1 - ((0-data.value) / maxInt)), 0, maxInt);
						} else {
							client.clockwise(minMax(data.value / maxInt, 0, maxInt));
						}
						break;
					case 2: // Right left/right
						if (data.value > 0-deadZone && data.value < deadZone) {
							client.stop();	
						} else if (data.value < 0) {
							client.left(minMax(1 - ((0-data.value) / maxInt)), 0, maxInt);
						} else {
							client.right(minMax(data.value / maxInt, 0, maxInt));
						}
						break;
				}
			});
	}
};
return driver;
