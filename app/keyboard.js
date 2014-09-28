key('a', function() {
	ngApply('pilotController', function($scope) {
		$scope.move('forward');
	});
});
