app.controller('infoController', function($scope, $rootScope, $timeout, Device) {
	var device = {};

	if (!$scope.id)
		$scope.id = $scope.config.devices.drone;

	// Refresh {{{
	$scope.refresh = function() {
		Device.get({id: $scope.id}).$promise
			.then(function(data) {
				if (!data.id)
					return;
				$scope.device = data;
				console.log('Update', $scope.device.id);
				$rootScope.$broadcast('updateDevice', $scope.device);
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
