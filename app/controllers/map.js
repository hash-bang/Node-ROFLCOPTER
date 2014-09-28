app.controller('mapController', function($scope) {
	$scope.autoCenter = true;
	$scope.map = {
		zoom: 20,
		center: {
			latitude: 153.41452289999998,
			longitude: -28.0787291
		},
		// options {{{
		options: {
			streetViewControl: false,
			styles: [
				{
					"featureType": "water",
					"stylers": [
						{
							"color": "#021019"
						}
					]
				},
				{
					"featureType": "landscape",
					"stylers": [
						{
							"color": "#08304b"
						}
					]
				},
				{
					"featureType": "poi",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#0c4152"
						},
						{
							"lightness": 5
						}
					]
				},
				{
					"featureType": "road.highway",
					"elementType": "geometry.fill",
					"stylers": [
						{
							"color": "#000000"
						}
					]
				},
				{
					"featureType": "road.highway",
					"elementType": "geometry.stroke",
					"stylers": [
						{
							"color": "#0b434f"
						},
						{
							"lightness": 25
						}
					]
				},
				{
					"featureType": "road.arterial",
					"elementType": "geometry.fill",
					"stylers": [
						{
							"color": "#000000"
						}
					]
				},
				{
					"featureType": "road.arterial",
					"elementType": "geometry.stroke",
					"stylers": [
						{
							"color": "#0b3d51"
						},
						{
							"lightness": 16
						}
					]
				},
				{
					"featureType": "road.local",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#000000"
						}
					]
				},
				{
					"elementType": "labels.text.fill",
					"stylers": [
						{
							"color": "#ffffff"
						}
					]
				},
				{
					"elementType": "labels.text.stroke",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 13
						}
					]
				},
				{
					"featureType": "transit",
					"stylers": [
						{
							"color": "#146474"
						}
					]
				},
				{
					"featureType": "administrative",
					"elementType": "geometry.fill",
					"stylers": [
						{
							"color": "#000000"
						}
					]
				},
				{
					"featureType": "administrative",
					"elementType": "geometry.stroke",
					"stylers": [
						{
							"color": "#144b53"
						},
						{
							"lightness": 14
						},
						{
							"weight": 1.4
						}
					]
				}
			]
		}
		// }}}
	};
	$scope.devices = [];

	$scope.$on('updateDevice', function(e, device) {
		var existingDevice = _.find($scope.devices, {id: device.id});
		if (existingDevice) {
			existingDevice = device;
		} else {
			$scope.devices.push(device);
		}
		if (device.geoLocation && device.geoLocation.lat) {
			$scope.map.center.latitude = device.geoLocation.lat;
			$scope.map.center.longitude = device.geoLocation.long;
		}
	});
});
