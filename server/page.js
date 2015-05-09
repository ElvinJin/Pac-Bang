var express = require('express');
var bodyParser = require('body-parser');
var RService = require('./RService');
var pageService = function(app){
	app.use('/static', express.static('static'));
	app.use(bodyParser.json());
	app.use(RService);
	app.use(function(req, res, next){
		res.status(404);
		// respond with json
    	res.json({ Error: 'Unknown Request' });
	});
	return app;
};


module.exports = pageService;