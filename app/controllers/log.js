app.controller('logController', function($scope, $rootScope, $timeout, Logs) {
	$scope.logs = [];
	$scope.autoScroll = true;

	$scope.refresh = function() {
		Logs.query().$promise
			.then(function(data) {
				$scope.logs = data;
				if ($scope.autoScroll)
					$('#logArea').scrollTo('100%');
			})
			.finally(function() {
				if ($scope.config.autoRefresh.logs)
					$timeout($scope.refresh, $scope.config.autoRefresh.logs);
			});
	};
	$scope.refresh();

	$scope.setAutoScroll = function(method) {
		if (method == 'toggle') {
			$scope.autoScroll = ! $scope.autoScroll;
		} else {
			$scope.autoScroll = method;
		}
	};
});

$(function() {
	$(document).on('mousewheel', '#logArea', function() { // When mouse scrolling - set the autoScroll to off
		angular.element($('#logController')).scope().setAutoScroll(false);
	});
});
