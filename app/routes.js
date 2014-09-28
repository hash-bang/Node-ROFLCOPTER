app.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {templateUrl: "/templates/home.html"})
		.when('/settings', {templateUrl: "/templates/settings.html"});
});
