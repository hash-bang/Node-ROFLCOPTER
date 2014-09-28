key('w', function() {
	ngApply('pilotController', function($scope) {
		$scope.move('forward');
	});
});

key('s', function() {
	ngApply('pilotController', function($scope) {
		$scope.move('backward');
	});
});

key('a', function() {
	ngApply('pilotController', function($scope) {
		$scope.move('left');
	});
});

key('d', function() {
	ngApply('pilotController', function($scope) {
		$scope.move('right');
	});
});

key('q', function() {
	ngApply('pilotController', function($scope) {
		$scope.rotate('antiClockwise');
	});
});

key('e', function() {
	ngApply('pilotController', function($scope) {
		$scope.rotate('clockwise');
	});
});

key('space', function() {
	ngApply('pilotController', function($scope) {
		$scope.action('land');
	});
});

key('p', function() {
	ngApply('pilotController', function($scope) {
		$scope.altitude('up');
	});
});

key('l', function() {
	ngApply('pilotController', function($scope) {
		$scope.altitude('down');
	});
});

key(['backspace', 'r'], function() {
	ngApply('pilotController', function($scope) {
		$scope.action('reset');
	});
});

key('escape', function() {
	ngApply('pilotController', function($scope) {
		$scope.action('stop');
	});
});
