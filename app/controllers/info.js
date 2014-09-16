app.controller('infoController', function($scope) {
	$scope.$watch('droid', function() {
		if ($scope.droid && $scope.droid.rotation && $scope.droid.rotation.x)
			$('#cube').css('transform', 'rotateX(' + $scope.droid.rotation.x + 'deg) ' + 'rotateY(' + $scope.droid.rotation.y + 'deg) ' + 'rotateZ(' + $scope.droid.rotation.z + 'deg)');
	});

});
