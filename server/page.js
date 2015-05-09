var express = require('express');
var bodyParser = require('body-parser');
var RService = require('./RService');
var pageService = function(app){
	app.use('/static', express.static('static'));
	app.use(bodyParser.json());
	app.use(function(req, res, next){
		if (!req.is('json')){
			res.send({ error: 'Require json type'});
		}
		next();
	});
	app.use(RService);
	app.use(function(req, res, next){
		res.status(404);
		// respond with json
  		if (req.accepts('json')) {
    		res.send({ error: 'Not found' });
    		return;
  		}

  		// default to plain-text. send()
  		res.type('txt').send('Not found');
	});
	return app;
};


module.exports = pageService;