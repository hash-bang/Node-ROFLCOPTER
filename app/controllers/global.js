// App global controller (also $rootScope)
app.controller('globalController', function($scope, $rootScope, $timeout, Device) {
	$rootScope.droid = {};
	$scope.id = 'nova';

	$scope.refresh = function() {
		Device.get({id: $scope.id}).$promise
			.then(function(data) {
				$rootScope.droid = data;
			})
			.finally(function() {
				if ($scope.config.autoRefresh.device)
					$timeout($scope.refresh, $scope.config.autoRefresh.device);
			});
	};
	$scope.refresh();
});
