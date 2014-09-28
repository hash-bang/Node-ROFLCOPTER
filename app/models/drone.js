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
		move: {url: '/api/actions/move/:direction/:speed?'}
	});
});
