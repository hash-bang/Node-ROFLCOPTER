var _ = require('lodash');
var path = require('path');
var fs = require('fs');

// Determine 'ENV' {{{
var env = 'dev';
if (process.env.OPENSHIFT_NODEJS_IP) {
	env = 'openshift';
} else if (process.env.NODE_ENV) { // Inherit from NODE_ENV
	env = process.env.NODE_ENV;
}
// }}}

var defaults = {
	env: env,
	root: path.normalize(__dirname + '/..'),
	host: '127.0.0.1',
	port: process.env.PORT || 9000,
	url: 'http://localhost',
	drone: {
		ip: '192.168.1.1',
		frameRate: 5,
		defaults: {
			upSpeed: 0.4,
			downSpeed: 0.4,
			forwardSpeed: 0.4,
			backwardSpeed: 0.4,
			leftSpeed: 0.4,
			rightSpeed: 0.4,
			clockwiseSpeed: 0.4,
			antiClockwiseSpeed: 0.4,
		}
	},
	logFile: '/tmp/roflcopter.log'
};

module.exports = _.merge(
	defaults,
	fs.existsSync('./config/private.js') ? require('./private.js') : {},
	fs.existsSync('./config/' + defaults.env + '.js') ? require('./' + defaults.env + '.js') : {}
);
