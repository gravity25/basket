var mongoose = require('mongoose'),
	Product = require("./product.js"),
	Catagory = require('./catagory.js'),
	User = require('./user.js');

var url = "mongodb://localhost:27017/test5";
mongoose.connect(url);

Product.create(product, function(err, product){
	if(err)
    	console.log(err);
  	else
    	console.log(product);
});

User.create(user, function(err, user){
	if(err)
    	console.log(err);
  	else
    	console.log(user);
});