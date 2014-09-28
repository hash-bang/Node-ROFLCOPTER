app.controller('slaveController', function($scope, $timeout, $location, Slave) {
	var pathBits = window.location.pathname.match(/\/slave\/(.*)$/);
	$scope.id = pathBits ? pathBits[1] : 'unknown';

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

	// Setup {{{
	$scope.setup = function() {
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
	};
	// }}}

	// .dirty tracking {{{
	$scope.dirty = false;
	$scope.$watch('rotation', function() {
		$scope.dirty = true;
	});
	$scope.$watch('acceleration', function() {
		$scope.dirty = true;
	});
	$scope.$watch('geoLocation', function() {
		$scope.dirty = true;
	});
	// }}}

	// Periodic saving {{{
	$scope.save = function() {
		if ($scope.dirty) {
			console.log('SLAVE', $scope.id);
			$scope.dirty = false;
			Slave.save({id: $scope.id}, {
				rotation: $scope.rotation,
				acceleration: $scope.acceleration,
				geoLocation: $scope.geoLocation
			}).$promise
				.finally(function() {
					if ($scope.config.autoRefresh.slavePost)
						$timeout($scope.save, $scope.config.autoRefresh.slavePost);
				});
		} else {
			if ($scope.config.autoRefresh.slavePost)
				$timeout($scope.save, $scope.config.autoRefresh.slavePost);
		}
	};
	if ($scope.config.autoRefresh.slavePost) // Kick off initial save
		$timeout($scope.save, $scope.config.autoRefresh.slavePost);
	// }}}
});
