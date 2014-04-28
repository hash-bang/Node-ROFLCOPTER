var colors = require('colors');

module.exports = {
	client: null,

	prepare: function() {
		console.log('Prepare...'.blue);
		return 1;
	},

	listen: function() {
		console.log('Listen...'.blue);
	}
}
