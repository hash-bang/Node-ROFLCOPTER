// App global controller (also $rootScope)
app.controller('globalController', function($scope, $rootScope, $timeout, Slave) {
	$rootScope.droid = {};
	$scope.id = 'nova';

	$scope.refresh = function() {
		Slave.get({id: $scope.id}).$promise
			.then(function(data) {
				$rootScope.droid = data;
			})
			.finally(function() {
				if ($scope.config.autoRefresh.slave)
					$timeout($scope.refresh, $scope.config.autoRefresh.slave);
			});
	};
	$scope.refresh();
});
