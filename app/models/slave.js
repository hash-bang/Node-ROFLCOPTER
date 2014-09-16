app.factory('Slave', function($resource){
	return $resource('/api/slave', {}, {
	});
});
