var colors = require('colors');


var x11 = require('x11');

var ks = x11.keySyms;
var ks2Name = {};
for (var key in ks)
	ks2Name[ ks[key] ] = key;
var kk2Name = {};

module.exports = {
	client: null,

	prepare: function() {
		console.log('Prepare...'.blue);
		x11.createClient(function(err, display) {
			var X = display.client;
			var min = display.min_keycode;
			var max = display.max_keycode;
			X.GetKeyboardMapping(min, max-min, function(err, list) {
			for (var i=0; i < list.length; ++i)
				{
					var name = kk2Name[i+min] = [];
					var sublist = list[i];
					for (var j =0; j < sublist.length; ++j)
				name.push(ks2Name[sublist[j]]);
				}

				var root = display.screen[0].root;
				var wid = X.AllocID();
				var white = display.screen[0].white_pixel;
				var black = display.screen[0].black_pixel;
				X.CreateWindow(wid, root, 10, 10, 400, 300, 0, 0, 0, 0, { backgroundPixel: white, eventMask: x11.eventMask.KeyPress + x11.eventMask.KeyRelease});
				X.MapWindow(wid);

				X.on('event', function(ev) {
					if (ev.name = 'KeyPress') {
						this.trigger('keydown:' + String.fromCharCode(ev.keycode));
					} else if (ev.name = 'KeyRelease') {
						this.trigger('keyup:' + String.fromCharCode(ev.keycode));
						this.trigger('keypress:' + String.fromCharCode(ev.keycode));
					}
					console.log([ev.keycode, kk2Name[ev.keycode], ev]);
				});
			});
		});

		return 1;
	},

	listen: function() {
		console.log('Listen...'.blue);
	}
}
