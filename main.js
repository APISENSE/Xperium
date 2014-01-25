var loader = require('loader');
var carbon = require('carbonfootprint');
var fs = require('fs');

var data = loader.loadData('data-xperium/2014-01-17.json');

// Iterate over all users data
for (var u = 0; u < data.length; u++) {
	console.log('User ' + u);
	
	// For each ride
	data[u].forEach(function(ride, index) {
		console.log('\nRide ' + index);
		
		var totalDistance = 0;
		var averageSpeed = 0;
		
		var coordinates = ride.getCoordinates();
		for (var i = 1; i < coordinates.length; i++) {
			var t_1 = coordinates[i - 1];
			var t = coordinates[i];
			
			var acc = t.accuracy.toFixed(1);
			if (acc > 150) {
				console.log('Bad accuracy: ' + acc);
			}

			// compute distance
			totalDistance += t_1.distance(t);
			
			// aggregate speeds
			var speed = t_1.speed(t);
			averageSpeed += speed;
			
			var date = new Date(t.timestamp).toISOString().match(/(\d{2}:\d{2}:\d{2})/)[1];
			console.log('[' + date + '] ' + t.toString() + ' (' + speed.toFixed(1) + ' km/h)');
		}
		
		console.log('Total distance: ' + totalDistance.toFixed(1) + ' km');
		console.log('Average speed: ' + (averageSpeed / (coordinates.length - 1)).toFixed(1) + ' km/h');
	});
}