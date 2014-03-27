angular.module('CarbonFootprintCalculator', [])

.controller('mainController', function($scope, $http) {

	$scope.formData = {};

	/**
	 * Get users list
	 */
	$http.get('/api/users')
		 .success(function(data) {
			$scope.users = data;
		 })
		 .error(function(data) {
			console.log('Error: ' + data);
		 });

	/**
	 * Set up the map
	 */
	var map = new L.Map('map');

	// create the tile layer with correct attribution
	var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='Map data © OpenStreetMap contributors';
	var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 20, attribution: osmAttrib});   

	// start the map in Lille center
	map.setView(new L.LatLng(50.6372, 3.0633), 12);
	map.addLayer(osm);

	/**
	 * Get all rides and associate informations
	 */
	$scope.getCarbonFootprint = function(user) {
		var min = $scope.dates.min
		  , max = $scope.dates.max;

		$http.get('/api/' + user + '/' + min.yyyymmdd() + '/' + max.yyyymmdd())
			.success(function(data) {
				$scope.rides = data;

				// no rides
				if(data.length <= 0) {
					$(".alert").show();
				} else {
					console.log(data)
					$(".alert").hide();
				}

				/* 
				 * - Compute the global footprint
				 * - Compute the global footprint per km
				 * - Aggregate successive rides using the same transportation
				 */
				var totalEmission = 0.;
				var totalDistance = 0.;
				$scope.aggRides = [];
				data.forEach(function (ride, index) {
					totalEmission += ride.emission;
					totalDistance += ride.distance;

					// aggregation
					var prev = $scope.aggRides.length - 1;
					if(prev >= 0 && $scope.aggRides[prev].type === ride.type) {

						$scope.aggRides[prev].distance += ride.distance;
						$scope.aggRides[prev].emission += ride.emission;
						$scope.aggRides[prev].numberOfRides += 1;
						
					} else {
						// define path color
						var colorClass;
						switch(ride.type) {
						case 'train':
							colorClass = 'bg-table-train'; break;
						case 'car':
							colorClass = 'bg-table-car'; break;
						case 'walking':
							colorClass = 'bg-table-walking'; break;
						default:
							colorClass = '';
						}

						$scope.aggRides.push({
							type: ride.type,
							distance: ride.distance,
							emission: ride.emission,
							numberOfRides: 1,
							colorClass: colorClass
						});
					}
				});

				$scope.carbonFootprint = totalEmission.toFixed(1) + ' kg eq. CO₂';
				$scope.carbonFootprintPerKm = (totalEmission/totalDistance).toFixed(2) + ' kg eq. CO₂ per km';

				clearMap(map);
				addContent(map, data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
})

.directive('cfcDateslider', function() {
    return {
        restrict: 'A',
        require : 'ngModel',
        link : function (scope, element, attrs, ngModelCtrl) {
            $(function(){
                element.dateRangeSlider({
			    	arrows: false,
			    	wheelMode: "zoom",
			    	step: {
						days: 1
					},
					bounds:{
					    min: new Date(2013, 10, 02),
					    max: new Date()
					  },
					defaultValues: {
						min: new Date(2013, 11, 28),
						max: new Date()
					},
					range: {
			    		min: {
			    			days: 1
			    		},
			    	}
			    });

			    element.on('valuesChanged', function(e, data) {
			    	// Update slider view
			    	scope.$apply(function() {
			    		ngModelCtrl.$setViewValue(data.values);
			    	});

			    	// No user selected
			    	if (scope.user == undefined) {
			    		return;
			    	};
			    	
			    	// Update data
			    	scope.getCarbonFootprint(scope.user.user);
			    });
            });
        }
    };
});
	
/**
 * Clear all rides off the map
 */
function clearMap(m) {
    for(i in m._layers) {
        if(m._layers[i]._path == undefined) {
        	continue;   
        }

        try {
            m.removeLayer(m._layers[i]);
        } catch(e) {
            console.log("problem with " + e + m._layers[i]);
        }
    }
}

/**
* Look over the rides list and
*/
function addContent(map, rides) {
	rides.forEach(function(ride) {
		/*
		 * Build a array of all position and make markers 
		 * to give some information about the current position (speed, etc.)
		 */
		var latLonArray = [];
		ride.coordinates.forEach(function(coord, index) {
			latLonArray.push( L.latLng(coord.latitude, coord.longitude) );
		});

		// define path color
		var color;
		switch(ride.type) {
		case 'train':
			color = 'blue'; break;
		case 'car':
			color = 'red'; break;
		case 'walking':
			color = 'green'; break;
		default:
			color = 'gray';
		}

		/*
		 * Draw line between each point
		 */
		var p = L.polyline(latLonArray, {color: color})
				 .addTo(map)
		  		 .bindPopup('Total distance: '+ ride.distance.toFixed(3) +' km<br>\
		    Average speed: '+ ride.averageSpeed.toFixed(1) +' km/h<br>\
		    Average acceleration: '+ ride.averageAcc.toFixed(3) +' m/s&sup2;<br>\
		    Max speed: '+ ride.maxSpeed.toFixed(1) +' km/h<br>\
		    Carbon Footprint: '+ ride.emission.toFixed(1) +' Kg eq. CO₂');
	});
}