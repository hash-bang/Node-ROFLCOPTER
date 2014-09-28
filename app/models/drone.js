app.factory('Drone', function($resource) {
	/*
	var ws = ngSocket('ws://localhost');

	return {
		move: function(direction, speed) {
			ws.send({foo: bar});
		}
	};
	*/

	return $resource('/api/actions', {}, {
		move: {url: '/api/actions/move/:id/:direction/:speed?'},
		action: {url: '/api/action/:id/:action'},
		rotate: {url: '/api/action/:id/:direction'},
		altitude: {url: '/api/altitude/:id/:direction'}
	});
});
