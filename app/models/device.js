app.factory('Device', function($resource){
	return $resource('/api/device/:id', {}, {
	});
});
