var express = require('express');
var router = express.Router();
var path = require('path');

var events = require('events');
var logoutEvent = new events.EventEmitter();

var logout_msg;
logoutEvent.on('logout-msg', function(data){
		console.log(data.message);
		logout_msg = data.message;
	});

router.get('/', function(req, res, next){
	//res.sendFile(path.join(__dirname + '/../views/index.ejs'));
    if(!logout_msg){
    	res.render('index.ejs', { message: "", user: req.user });
    }
    else{
    	res.render('index.ejs', { message: logout_msg, user: req.user });
    	logout_msg = undefined;
    }

});

module.exports = {
	router: router,
	eventemitter: logoutEvent
};

//check for not logged in
function notLoggedIn(req, res, next){
  if (!req.isAuthenticated()){
    return next();
  };
  res.redirect('/');
}
