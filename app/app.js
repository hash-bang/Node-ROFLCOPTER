var app = angular.module("app", [
	'ngResource',
	'ngRoute'
]);

app.run(function($rootScope) {
	$rootScope.config = {
		autoRefresh: {
			logs: 1000,
			slavePost: 1000
		}
	};
});
