var app = angular.module("app", [
	'google-maps',
	'ngResource',
	'ngRoute'
]);

app.run(function($rootScope) {
	$rootScope.config = {
		devices: { // Backend ids for the various display devices
			drone: 'ardrone',
			android: 'android'
		},
		autoRefresh: {
			logs: 1000,
			device: 1000,
			deviceUpdate: 1000
		}
	};
});
