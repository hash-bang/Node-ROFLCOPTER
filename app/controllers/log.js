app.controller('logController', function($scope, $rootScope, $timeout, Logs) {
	$scope.logs = [];

	$scope.refresh = function() {
		Logs.query().$promise
			.then(function(data) {
				console.log('GOT DATA', data);
				$scope.logs = data;
			})
			.finally(function() {
				if ($scope.config.autoRefresh.logs)
					$timeout($scope.refresh, $scope.config.autoRefresh.logs);
			});
	};
	$scope.refresh();
});
