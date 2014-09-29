app.factory('Drone', function($resource) {
	return $resource('/api/actions', {}, {
		move: {url: '/api/actions/move/:id/:direction/:speed'},
		action: {url: '/api/actions/:action/:id'},
		rotate: {url: '/api/actions/rotate/:id/:direction/:speed'},
		altitude: {url: '/api/actions/altitude/:id/:direction/:speed'}
	});
});
