app.controller('mapController', function($scope, Slave) {
	$scope.autoCenter = true;
	$scope.drone = {};

	$scope.map = {
		center: {
			latitude: 45,
			longitude: -73
		},
		zoom: 20
	};

	$scope.refresh = function() {
		Slave.get({}).$promise
			.then(function(data) {
				$scope.drone = data;
				if ($scope.autoCenter) {
					$scope.map.center.latitude = $scope.drone.geoLocation.lat;
					$scope.map.center.longitude = $scope.drone.geoLocation.long;
				}
			})
			.finally(function() {
				if ($scope.config.autoRefresh.slave)
					$timeout($scope.refresh, $scope.config.autoRefresh.slave);
			});
	};
	$scope.refresh();

	$scope.setAutoCenter = function(method) {
		if (method == 'toggle') {
			$scope.autoCenter = ! $scope.autoCenter;
		} else {
			$scope.autoCenter = method;
		}
	};
});
