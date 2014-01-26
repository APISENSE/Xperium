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

app.get('/map/:file/:user', function(req, res) {
	var file = parseInt(req.params.file);
	var user = parseInt(req.params.user);
	
	var userData = [];
	if (file >= data.length) {
		throw 'Attribute error: this file reference doesn\'t exists';
	} else if(user >= data[file].length) {
		throw 'Attribute error: this user reference doesn\'t exists';
	} else {
		userData = data[file][user];
	}

    res.render('map.ejs', {data: userData});
})
.use(express.static(__dirname + '/public'))
.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page not found !');
});


app.listen(8080);