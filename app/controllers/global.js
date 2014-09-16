// App global controller (also $rootScope)
app.controller('globalController', function($scope, $rootScope, $timeout, Slave) {
	$rootScope.droid = {};

	$scope.refresh = function() {
		Slave.get({}).$promise
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
