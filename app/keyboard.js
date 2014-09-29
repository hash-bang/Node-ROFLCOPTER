key('w, up, ', function() {
	ngApply('pilotController', function($scope) {
		$scope.move('forward');
	});
});

key('s, down', function() {
	ngApply('pilotController', function($scope) {
		$scope.move('backward');
	});
});

key('a, left', function() {
	ngApply('pilotController', function($scope) {
		$scope.move('left');
	});
});

key('d, right', function() {
	ngApply('pilotController', function($scope) {
		$scope.move('right');
	});
});

key('q, [', function() {
	ngApply('pilotController', function($scope) {
		$scope.rotate('antiClockwise');
	});
});

key('e, ]', function() {
	ngApply('pilotController', function($scope) {
		$scope.rotate('clockwise');
	});
});

key('space, ., end', function() {
	ngApply('pilotController', function($scope) {
		$scope.action('land');
	});
});

key('p, pageup', function() {
	ngApply('pilotController', function($scope) {
		$scope.altitude('up');
	});
});

key('l, pagedown', function() {
	ngApply('pilotController', function($scope) {
		$scope.altitude('down');
	});
});

key('backspace, r', function() {
	ngApply('pilotController', function($scope) {
		$scope.action('reset');
	});
});

key('escape, home', function() {
	ngApply('pilotController', function($scope) {
		$scope.action('stop');
	});
});
