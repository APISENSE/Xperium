var loader = require('loader');
var carbon = require('carbonfootprint');

var data = loader.loadData('data-xperium/2014-01-13');

var totalDistance = 0;
for (var i = 1; i < data.length; i++) {
	var lat1 = data[i-1].latitude;
	var lon1 = data[i-1].longitude;
	
	var lat2 = data[i].latitude;
	var lon2 = data[i].longitude;
	
	distance = carbon.computeDistance(lat1, lon1, lat2, lon2);
	console.log(lat1 + "," + lon1 + " " + lat2 + "," + lon2 + " d: " +distance);
	
	totalDistance += distance;
}

console.log('Total distance: ' + totalDistance);