#!/usr/bin/env node
/**
* ROFLCopter Drone control
* @author Matt Carter <m@ttcarter.com>
* @url https://github.com/hash-bang/Node-ROFLCOPTER
* @package node-roflcopter
*/

// Requires {{{
var colors = require('colors');
var express = require('express');
var layouts = require('express-ejs-layouts')
var path = require('path');
var fs = require('fs');
var winston = require('winston');
global.app = express();
// }}}
// Global functions {{{
var requireTree = function(dir) {
	dir = path.join(__dirname, dir);
	fs.readdirSync(dir).forEach(function (file) {
		if (/(.*)\.(js$|coffee$)/.test(file))
			require(path.join(dir, file));
	});
}
// }}}
// Settings {{{
global.config = require('./config/global');
app.set('title', 'ROFLcopter');
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');
app.enable('view cache');
app.use(layouts);
// }}}
// Settings / Winston {{{
global.logger = new (winston.Logger)({
	transports: [
		new winston.transports.Console(),
		new (winston.transports.File)({ filename: config.logFile })
	]
});
// }}}
// Drone connection {{{
var arDrone = require('ar-drone');
logger.info('Connecting to drone at ' + config.drone.ip.cyan + '...');
global.drone  = arDrone.createClient({
	ip: config.drone.ip,
	frameRate: config.drone.frameRate
});
logger.info('Enabling data feed...');
drone.config({key: 'general:navdata_demo', value: 'TRUE', timeout: 1000}, function() {
	logger.info('[drone] Drone data feed ' + 'enabled'.green);
});
// }}}
// Controllers {{{
requireTree('controllers');
// }}}

// Static pages {{{
app.use(express.static(__dirname + '/public'));
app.use('/build', express.static(__dirname + '/build'));
app.use('/templates', express.static(__dirname + '/views/templates'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
// }}}

// Error catcher {{{
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.send(500, 'Something broke!');
});
// }}}

// Init {{{
var server = app.listen(config.port, config.host, function() {
	logger.log('Web interface listening on ' + (config.host + ':' + config.port).cyan);
});
// }}}
