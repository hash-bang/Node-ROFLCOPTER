app.controller('pilotController', function($scope, Drone) {
	$scope.status = 'Hello';

	$scope.move = function(direction, speed) {
		Drone.move({direction: direction, speed: speed}).$promise
			.then(function(data) {
				$scope.status = 'Moved ' + direction + ' @ ' + speed;
			});
	};
});
