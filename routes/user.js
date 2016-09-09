var express = require('express'),
    passport = require('passport'),
    fs = require('fs');
	  User = require('./../models/user.js'),
    Order = require('./../models/order.js'),
    path = require('path');


var Cart = require('./../models/cart.js');

var router = express.Router();

router.use(express.static(path.join(__dirname, '/../public')));

var logoutEvent = require('./index.js').eventemitter;


//multer is used to upload file
var multer = require('multer');
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {
    var name = req.user.user_id;
    callback(null, name);
  }
});
var upload = multer({ storage : storage}).single('userImage');


router.post('/profile/upload',  function(req, res, next) {

   upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        console.log(req.file);
        var contentType = req.file.mimetype;
        var id = req.user.id;
        //reading the image and saving/updating it in the database
         fs.readFile( req.file.path, function (err, data) {
            var update = { img: { data: data, contentType: contentType } };
            User.findByIdAndUpdate({ _id: id}, update, function(err, user){
              if(err){
                throw err;
              }
              fs.unlink(req.file.path, function(err){ //it will remove stored imajes and add new one.
                if(err) throw err;
                res.redirect('/user/profile');
              })
          });
        })
        

   }) 
});       





router.get('/profile', isLoggedIn, function(req, res){
  console.log(req.user);
  var img = "";
  if(req.user.img.data){
    img = new Buffer(req.user.img.data).toString('base64');
  }
  if (req.isAuthenticated() && (req.user.user_id=='varuns@123' || req.user.user_id=='garvit@123')){
    return res.render('profile.ejs', {user: req.user, admin:"admin", image: img });
  };
  res.render('profile.ejs', {user: req.user, admin: "", image: img });
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





