var express = require('express'),
    passport = require('passport'),
	  User = require('./../models/user.js'),
    Order = require('./../models/order.js'),
    path = require('path');


var Cart = require('./../models/cart.js');

var router = express.Router();

router.use(express.static(path.join(__dirname, '/../public')));

var logoutEvent = require('./index.js').eventemitter;




router.get('/profile', isLoggedIn, function(req, res){
  console.log(req.user);
  if (req.isAuthenticated() && (req.user.user_id=='varuns@123' || req.user.user_id=='garvit@123')){
    return res.render('profile.ejs', {user: req.user, admin:"admin"});
  };
  res.render('profile.ejs', {user: req.user, admin: ""});
});


router.post('/profile/:id', isLoggedIn, function(req, res, next){
  User.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
    if (err) return next(err);
    console.log(req.user);
    res.redirect('/user/profile');
  });
  console.log(req.user);
});


router.put('/profile/:id', isLoggedIn, function(req, res, next){

  User.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
    if (err) return next(err);
    console.log(req.body);
    res.redirect('/user/profile');
  });
});


router.get('/profile/myOrder', isLoggedIn, function(req, res, next){
  Order.find({user: req.user}, function(err, orders){
    if(err){
      return console.log(err);
    }
    if(orders){
      var cart;
      orders.forEach(function(order){
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
      });
      res.render('myOrder.ejs', {orders: orders, user: req.user});
    }
    else{
      console.log("no orders");
      res.render('myOrder.ejs', {orders: [], user: req.user});
    }
    
  });
});



router.get('/logout', isLoggedIn, function(req, res, next){
  //removing session
  req.session.destroy(function(err) {
    if(err){
      console.log(err);
    }
    });
  req.logout();    //method added by passport
  console.log("logging out");
  logoutEvent.emit('logout-msg', { "message": "you have successfully logged out."});
  res.redirect('/');
});




//use notloggedin for all user routes written after it
router.use('/', notLoggedIn, function(req, res, next){
  next();
});


router.get('/signup', function(req, res, next){
  var messages = req.flash('error');
  console.log(messages);
  // res.json({"error": true, "message": messages});
  res.render('signup.ejs', {message: messages, user: req.user });
});


router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));


router.get('/signin', function(req, res, next){
  var messages = req.flash('error');
  console.log(messages);
  // res.json({"error": true, "message": messages});
  res.render('signin.ejs', {message: messages, user: req.user });
});


router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/',
  failureRedirect: '/user/signin',
  failureFlash: true
}));


module.exports = router;


//passport method for logging in and logiing out
//middelware
//check for logged in
function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  };
  res.redirect('/');
}

//check for not logged in
function notLoggedIn(req, res, next){
  if (!req.isAuthenticated()){
    return next();
  };
  res.redirect('/');
}

function AdminLoggedIn(req, res, next){
  if (req.isAuthenticated() && (req.user.user_id=='varun@123' || req.user.user_id=='garvit@123')){
    return next();
  };
  res.redirect('/');
}





