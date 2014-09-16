var app = angular.module("app", [
	'google-maps',
	'ngResource',
	'ngRoute'
]);

app.run(function($rootScope) {
	$rootScope.config = {
		autoRefresh: {
			logs: 1000,
			slave: 1000,
			slavePost: 1000
		}
	};
});
