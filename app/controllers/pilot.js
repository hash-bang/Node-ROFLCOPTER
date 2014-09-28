app.controller('pilotController', function($scope, Drone, ngSocket) {
	$scope.status = 'Hello';

	$scope.move = function(direction, speed) {
		Drone.emit('move', 'forward');
		return;
		Drone.move({direction: direction, speed: speed}).$promise
			.then(function(data) {
				$scope.status = 'Moved ' + direction + ' @ ' + speed;
			});
	};
});
