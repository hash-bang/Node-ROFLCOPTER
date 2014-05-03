var colors = require('colors');
var util = require('util'); // FIXME: Rm

var minMax = function(value, min, max) {
	if (value < min) {
		value = min;
	} else if (value > max) {
		value = max;
	}
	return value;
}

var joystick; // Holder for Joystick driver

var deadZone = 1000;
var dPadXFunc, dPadXTimer, dPadYFunc, dPadYTimer; // Various timers
var heightSpeed = 0.4; // How quickly to increase height
var buttonSpeedX = 0.8; // Speed to increase / decrease something on button repeats
var buttonRepeatX = 100; // How often to retrigger button events
var buttonSpeedY = 0.5; // Speed to increase / decrease something on button repeats
var buttonRepeatY = 100;
var maxInt = 32768;

module.exports = me = {
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
				switch(data.number) {
					// D-Pad {{{
					case 0: // D-Pad Up
						if (data.value) {
							clearTimeout(me.dPadYTimer);
							dPadYFunc = function() {
								if (!dPadYFunc)
									return;
								me.client.front(buttonSpeedY);
								setTimeout(dPadYFunc, buttonRepeatY);
							};
							me.dPadYTimer = setTimeout(dPadYFunc, buttonRepeatY);
							console.log('Status'.green, 'Begin move forward');
						} else {
							console.log('Status'.green, 'Stop move forward');
							dPadYFunc = null;
							clearTimeout(me.dPadYTimer);
							me.client.stop();
						}
						break;
					case 1: // D-Pad Down
						if (data.value) {
							clearTimeout(me.dPadYTimer);
							dPadYFunc = function() {
								if (!dPadYFunc)
									return;
								me.client.back(buttonSpeedY);
								setTimeout(dPadYFunc, buttonRepeatY);
							};
							me.dPadYTimer = setTimeout(dPadYFunc, buttonRepeatY);
							console.log('Status'.green, 'Begin move backwards');
						} else {
							console.log('Status'.green, 'Stop move backwards');
							dPadYFunc = null;
							clearTimeout(me.dPadYTimer);
							me.client.stop();
						}
						break;
					case 2: // D-Pad Left
						if (data.value) {
							clearTimeout(me.dPadXTimer);
							dPadXFunc = function() {
								if (!dPadXFunc)
									return;
								me.client.counterClockwise(buttonSpeedX);
								setTimeout(dPadXFunc, buttonRepeatX);
							};
							me.dPadXTimer = setTimeout(dPadXFunc, buttonRepeatX);
							console.log('Status'.green, 'Begin rotate Counter-clockwise');
						} else {
							console.log('Status'.green, 'Stop rotate Counter-clockwise');
							dPadXFunc = null;
							clearTimeout(me.dPadXTimer);
							me.client.stop();
						}
						break;
					case 3: // D-Pad Right
						if (data.value) {
							clearTimeout(me.dPadXTimer);
							dPadXFunc = function() {
								if (!dPadXFunc)
									return;
								me.client.clockwise(buttonSpeedX);
								setTimeout(dPadXFunc, buttonRepeatX);
							};
							me.dPadXTimer = setTimeout(dPadXFunc, buttonRepeatX);
							console.log('Status'.green, 'Begin rotate Clockwise');
						} else {
							console.log('Status'.green, 'Stop rotate Clockwise');
							dPadXFunc = null;
							clearTimeout(me.dPadXTimer);
							me.client.stop();
						}
						break;
					// }}}
					case 12: // Select
						if (data.value) {
							console.log('Status'.bold.green, 'Emergency Disabled');
							me.client.disableEmergency();
						}
						break;
					case 13: // Start button
						if (data.value) {
							me.client.disableEmergency();
							console.log('Status'.bold.green, 'Take off!');
							me.client.takeoff(function() {
								console.log('Status'.bold.green, 'Take off confirm');
							});
						}
						break;
					case 14: // Xbox logo
						if (data.value) {
							console.log('Status'.bold.green, 'Land');
							me.client.land();
						}
						break;
					case 11: // Right back shoulder
						if (data.value) {
							console.log('Altitude'.magenta, '+' + heightSpeed);
							me.client.up(heightSpeed);
						} else {
							me.client.stop();
						}
						break;
					case 10: // Left back shoulder
						if (data.value) {
							console.log('Altitude'.magenta, '-' + heightSpeed);
							me.client.down(heightSpeed);
						} else {
							me.client.stop();
						}
						break;
					case 7: // Y
						if (data.value) {
							console.log('Animate'.bold.yellow, 'flipAhead');
							me.client.animate('flipAhead', 250);
						}
						break;
					case 4: // A
						if (data.value) {
							console.log('Animate'.bold.yellow, 'vzDance');
							me.client.animate('vzDance', 250);
						}
						break;
					case 6: // X
						if (data.value) {
							console.log('Animate'.bold.yellow, 'flipLeft');
							me.client.animate('flipLeft', 250);
						}
						break;
					case 5: // B
						if (data.value) {
							console.log('Animate'.bold.yellow, 'flipRight');
							me.client.animate('flipRight', 250);
						}
						break;
					case 15: // Joystick Left
					case 16: // Joystick Right
						console.log('Status'.bold.red, 'Stop');
						if (data.value) {
							me.client.stop();
						}
				}
			})
			.on('axis', function(data) {
				var value;
				switch(data.number) {
					case 1: // Left up/down
					case 3: // Right up/down
						if (data.value > 0-deadZone && data.value < deadZone) {
							me.client.stop();	
						} else if (data.value < 0) {
							me.client.front(minMax(1 - ((0-data.value) / maxInt)), 0, maxInt);
						} else {
							me.client.back(minMax(data.value / maxInt, 0, maxInt));
						}
						break;
					case 0: // Left left/right
						if (data.value > 0-deadZone && data.value < deadZone) {
							me.client.stop();	
						} else if (data.value < 0) {
							me.client.counterClockwise(minMax(1 - ((0-data.value) / maxInt)), 0, maxInt);
						} else {
							me.client.clockwise(minMax(data.value / maxInt, 0, maxInt));
						}
						break;
					case 2: // Right left/right
						if (data.value > 0-deadZone && data.value < deadZone) {
							me.client.stop();	
						} else if (data.value < 0) {
							me.client.left(minMax(1 - ((0-data.value) / maxInt)), 0, maxInt);
						} else {
							me.client.right(minMax(data.value / maxInt, 0, maxInt));
						}
						break;
				}
			});
	}
};
