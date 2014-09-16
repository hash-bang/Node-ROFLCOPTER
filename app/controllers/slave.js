app.controller('slaveController', function($scope) {
	$scope.rotation = {
		x: 0,
		y: 0,
		z: 0
	};
	$scope.acceleration = {
		x: 0,
		y: 0,
		z: 0
	};
	$scope.geoLocation = {
		long: 0,
		lat: 0
	};
});

$(function() {
	$(window)
		.on('deviceorientation', function(e) {
			ngApply('slaveController', function($scope) {
				$scope.rotation.x = event.beta;
				$scope.rotation.y = event.gamma;
				$scope.rotation.z = event.alpha;
			});
		})
		.on('devicemotion', function(e) {
			ngApply('slaveController', function($scope) {
				$scope.acceleration.x = event.acceleration.x;
				$scope.acceleration.y = event.acceleration.y;
				$scope.acceleration.z = event.acceleration.z;
			});
		});


		if (navigator.geolocation)
			navigator.geolocation.watchPosition(function(position) {
				ngApply('slaveController', function($scope) {
					$scope.geoLocation.long = position.coords.longitude;
					$scope.geoLocation.lat = position.coords.latitude;
				});
			}, function() {}, {enableHighAccuracy: true});

});
