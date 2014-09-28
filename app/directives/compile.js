/**
* Directive to dynamically compile an Angular template (from a variable) and render the result into the element
* @author Matt Carter <m@ttcarter.com>
*
* In the controller:
*	$scope.html = "Hello {{name}}";
*
* In HTML:
* 	<div compile="html"></div>
*
*/
app.directive('compile', function($compile) {
	return function(scope, element, attrs) {
		scope.$watch(
			function(scope) {
				return scope.$eval(attrs.compile);
			},
			function(value) {
				element.html(value);
				$compile(element.contents())(scope);
			}
		);
	};
});
