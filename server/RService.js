var express = require('express');
var router = express.Router();
var hash = require('./tools/hash.js');
var resErr = require('./tools/res.js');

var uuid = require("node-uuid");

var users = require("./tools/db.js");

router.get('/user/:username', function(req, res, next){
	var err = null;
	var username = req.params.username;
	users.findOne({_id: username}, function(e, user){
		err = e;
		if (!user) err = "Unknown user";
		delete user["password"];
		user["username"] = user["_id"];
		delete user["_id"];
		delete user["session"];
		res.json(resErr(err, user));
	});
});


router.post('/user/:username', function(req, res, next){
	var err = null;
	var username = req.params.username;
	var password = hash(req.body.password);
	var email = req.body.email;
	users.insert({_id: username, password: password, email: email, exp: 0, gold: 0, total:0, win:0, session: null}, function(e){
		err = e;
		if (err && err.code == 11000){
			err = "Duplicated username";
		}
		res.json(resErr(err, {Error: null}));
	});
});
router.put('/user/:username', function(req, res, next){
	var err = null;
	var username = req.params.username;
	var password = hash(req.body.password);
	users.findOne({_id: username, password: password}, function(e, user){
		if (e) err = e;
		else if (!user) err = "Invalid username or password";

		if (err){
			res.json(resErr(err));
		}
		else {
			for (var field in req.body.userInf){
				if (req.body.userInf.hasOwnProperty(field) && user.hasOwnProperty(field)){
					user[field] = req.body.userInf[field];
				}
			}
			users.update({_id: username}, user, function(e){
				if (e) err = e;
				res.json(resErr(err, {"Error": null}));
			});
		}
	});
});
router.post('/auth/:username', function(req, res, next) {
	var err = null;
	var username = req.params.username;
	var password = hash(req.body.password);
	users.findOne({_id: username, password: password}, function(e, user){
		if (e) err = e;
		else if (!user) err = "Invalid username or password";
		if (err) {
			res.json(resErr(err));
			return;
		}
		var sessionId = uuid.v1();
		users.update({_id: username}, {$set: {session: sessionId}}, function(e){
			if (user){
				user["username"] = user["_id"];
				delete user["id"];
				delete user["session"];
				delete user["password"];
			}
			err = e;
			res.json(resErr(e, {session: sessionId, userInf: user}));
		});

	});
});

module.exports = router;