/**
 * Node.js server mail class
 */
var express = require('express');

// APISense data
var loader = require('loader');
var data = loader.loadData('data-xperium/2014-01-17.json');

var app = express();
console.log('Server started!');

app.get('/map/:user', function(req, res) {
	var userData = data[parseInt(req.params.user)];
	var rideList = [];
	
	userData.forEach(function(ride) {
		var coordinates = ride.getCoordinates();
		coordinates.forEach(function(coord, index) {
			coordinates[index] = coord.toString();
		});
		
		rideList.push(coordinates);
	});
	
    res.render('map.ejs', {data: rideList});
})
.use(express.static(__dirname + '/public'))
.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page not found !');
});


app.listen(8080);