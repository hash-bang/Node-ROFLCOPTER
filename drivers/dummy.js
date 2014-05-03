/**
* ROFLCopter dummy driver
*
* This driver will inject itself between the drone client and another driver and relay all commands sent to the client to the console. It can also forward them onto the client if required.
* This driver is good for debugging as it shows what the driver thinks should be sent to the drone without actually sending it.
*
* Example usage:
*
*	// Load the keyboard driver and show all commands that WOULD be executed as keys are pressed
*	roflcopter  --input dummy --driveroptions keyboard
*
*
* @author Matt Carter <m@ttcarter.com>
* @url https://github.com/hash-bang/Node-ROFLCOPTER
* @package node-roflcopter
*/

var colors = require('colors');
var util = require('util');

module.exports = {
	program: null,
	client: null,
	fakeClient: null,
	subdriver: null,
	forward: false, // Whether to forward all calls to the real client when we finish with them

	baseClient: function() {
	},

	prepare: function() {
		console.log('Prepare dummy wrapper...'.blue);
		this.subdriver = require('./' + this.program.driveroptions + '.js');
		if (!this.subdriver) {
			console.log('Invalid subdriver: ' + this.program.driveroptions.red);
			return;
		}
		this.subdriver.prepare();
		return 1;
	},

	injectFakeClient: function() {
		console.log('Injecting driver method listeners...'.inverse);
		this.fakeClient = new this.baseClient();
		for (var f in this.client) {
			if (f.substr(0, 1) != '_') { // Not a private function
				var realFunc = this.client[f];
				this.fakeClient[f] = function() {
					console.log('client.' + f.inverse + '()'.inverse);
					/* if (this.forward)
						realFunc(); */
				};
				console.log('Map method', f);
			}
		}
		this.fakeClient.hello = function() { console.log('HELLO WORLD'.bold.red); };
		this.subdriver.client = this.fakeClient;
	},

	listen: function() {
		this.injectFakeClient();
		console.log('CLIENT ISX');
		console.log(util.inspect(this.subdriver.client, {showHidden: true, colors: true}));
		this.subdriver.listen();
	}
}
