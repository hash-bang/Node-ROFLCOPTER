app.controller('infoController', function($scope, $timeout, Device) {
	var device = {};

	if (!$scope.id)
		$scope.id = $scope.config.devices.drone;

	// Refresh {{{
	$scope.refresh = function() {
		Device.get({id: $scope.id}).$promise
			.then(function(data) {
				$scope.device = data;
			})
			.finally(function() {
				if ($scope.config.autoRefresh.device)
					$timeout($scope.refresh, $scope.config.autoRefresh.device);
			});
	};
	$scope.refresh();
	// }}}

	$scope.$watch('device', function() {
		if ($scope.device && $scope.device.rotation && $scope.device.rotation.x)
			$('#cube').css('transform', 'rotateX(' + $scope.device.rotation.x + 'deg) ' + 'rotateY(' + $scope.device.rotation.y + 'deg) ' + 'rotateZ(' + $scope.device.rotation.z + 'deg)');
	});
});
