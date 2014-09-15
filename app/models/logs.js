app.factory('Logs', function($resource) {
	return $resource('/api/logs', {}, {
	});
});
