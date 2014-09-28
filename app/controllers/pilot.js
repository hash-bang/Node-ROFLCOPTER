app.controller('pilotController', function($scope, Drone) {
	if (!$scope.id)
		$scope.id = $scope.config.devices.drone;

	$scope.status = 'Hello';

	$scope.move = function(direction, speed) {
		Drone.move({
			id: $scope.id,
			direction: direction,
			speed: speed
		}).$promise
			.then(function(data) {
				$scope.status = 'Moved ' + direction + ' @ ' + speed;
			});
	};

	$scope.action = function(action) {
		Drone.action({
			id: $scope.id,
			action: action,
		}).$promise
			.then(function(data) {
				$scope.status = 'Action ' + action + ' completed';
			});
	};

	$scope.rotate = function(direction, speed) {
		Drone.action({
			id: $scope.id,
			direction: direction,
			speed: speed
		}).$promise
			.then(function(data) {
				$scope.status = 'Altitude ' + direction + ' @ ' + speed + ' completed';
			});
	};

	$scope.rotate = function(direction, speed) {
		Drone.action({
			id: $scope.id,
			direction: direction,
			speed: speed
		}).$promise
			.then(function(data) {
				$scope.status = 'Rotate ' + direction + ' @ ' + speed + ' completed';
			});
	};
});
