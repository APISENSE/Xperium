/**
 * Node.js server mail class
 */

/*
 * Processing data
 */
var loader = require('loader');
var data = loader.loadData('data-xperium');

/*
 * Running server
 */
var express = require('express');
var app = express();

app.configure(function() {
	app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
	app.use(express.logger('dev')); 						// log every request to the console
	app.use(express.bodyParser()); 							// pull information from html in POST
	app.use(express.methodOverride()); 						// simulate DELETE and PUT
})

//XXX deprecated
.get('/map/:user/:date', function(req, res) {
	var user = req.params.user;
	var date = req.params.date;

	if (!(user in data)) {
		throw 'Attribute error: this user reference doesn\'t exists';
	}
	
	if(!(date in data[user])) {
		throw 'Attribute error: this date reference doesn\'t exists';
	}
	
	// users list
	usersId = [];
	for(var id in data) {
		usersId.push(id);
	}
	
	// days available for this user
	userDays = [];
	for(var day in data[user]) {
		userDays.push(day);
	}
	
    res.render('map.ejs', {users: usersId, days: userDays, data: data[user][date]});
})

/*
 * 
 * AngularJS Frontend
 * 
 */
.get('/map', function(req, res) {
	//TODO
})

/*
 * 
 * JSON API
 * 
 */
/**
 * Return all users ID in JSON format
 */
.get('/api/users', function(req, res) {
	
	// users list
	users = [];
	for(var id in data) {		
		// days available for this user
		dates = [];
		for(var date in data[id]) {
			dates.push(date);
		}
		
		users.push({
			"user": id,
			"dates": dates
		});
	}
	
	res.json(users);
})

/**
 * Return all user's rides in JSON format
 */
.get('/api/:user', function(req, res) {
	var user = req.params.user;

	if (!(user in data)) {
		throw 'Attribute error: this user reference doesn\'t exists';
	}
	
	var allRides = [];
	for(var key in data[user]) {
		allRides = allRides.concat(data[user][key]);
    }
	
	res.json(allRides);
})

/**
 * Return all user's rides for a given date in JSON format
 */
.get('/api/:user/:date', function(req, res) {
	var user = req.params.user;
	var date = req.params.date;

	if (!(user in data)) {
		throw 'Attribute error: this user reference doesn\'t exists';
	}
	
	if(!(date in data[user])) {
		throw 'Attribute error: this date reference doesn\'t exists';
	}
	
	res.json(data[user][date]);
})

/**
 * 404 Error page
 */
.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page not found !');
});


app.listen(8080);
console.log("App listening on port 8080");