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
console.log('Server started!');

app.get('/map/:user/:date', function(req, res) {
	var user = req.params.user;
	var date = req.params.date;

	if (!(user in data)) {
		throw 'Attribute error: this user reference doesn\'t exists';
	}
	
	if(!(date in data[user])) {
		throw 'Attribute error: this date reference doesn\'t exists';
	}
	
	usersId = [];
	for(var id in data) {
		usersId.push(id);
	}
	
	userDays = [];
	for(var date in data[user]) {
		userDays.push(date);
	}
	
    res.render('map.ejs', {users: usersId, days: userDays, data: data[user][date]});
})
.use(express.static(__dirname + '/public'))
.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page not found !');
});


app.listen(8080);