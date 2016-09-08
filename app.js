
var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    flash = require('connect-flash'),
    validator = require('express-validator'),
    MongoStore = require('connect-mongo')(session);
    path = require('path');
    ejs = require('ejs');


var app = express();

var index = require('./routes/index.js').router;
var admin = require('./routes/admin.js');
var user = require("./routes/user.js");
var products = require("./routes/product.js");
var addToCart = require('./routes/cart.js');
//var catagory = require('./routes/catagory.js')


//var url = "mongodb://localhost:27017/basket_varun";

//connect to the mongod server
//mongoose.connect(url);
require('./config/server');
require('./config/passport');

//Parses the text as JSON and exposes the resulting object on req.body
app.use(bodyParser.json());
//urlecncode set to true if body is sent by url
app.use(bodyParser.urlencoded({ extended: false }));
//upload the file in tmp directory

//retrive the body parameters and validate the submit request
app.use(validator());
//set to use cookie-parser
app.use(cookieParser());
//set session
app.use(session({
	secret: "secretkeytosavesession", //secret used to sign the session ID cookie
	resave: false, //Forces the session to be saved back to the session store, even if the session was never modified during the request.
	saveUninitialized: false, //Forces a session that is "uninitialized" to be saved to the store
	store: new MongoStore({ mongooseConnection: mongoose.connection }), //use existing mongoose connection
	cookie: ({ maxAge: 24*60*60*1000}) //session expiry time
}));
//flash initializatoin
app.use(flash());
//passport initialization
app.use(passport.initialize());
app.use(passport.session());

//load the files in public directory
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(function(req, res, next){
	res.locals.signin = req.isAuthenticated();
	res.locals.session = req.session;
	next();
});

//for all /api requests use api from /routes/api
app.use('/', index);
app.use('/admin', admin);
app.use('/user', user);
app.use('/products', products);
app.use('/add-to-cart', isLoggedIn, addToCart);
//app.use('/pd/catagory', catagory);

// app.listen(3000);
// console.log('Listening on port 3000!');


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;

function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  };
  res.redirect('/user/signin');
}

