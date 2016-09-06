var express = require('express'),
    mongoose = require('mongoose'),
    Products = require('./../models/product.js'),
    catagorySchema = require('./../models/catagory.js'),
    path = require('path');

var Catagory = mongoose.model('Catagory', catagorySchema);


var router = express.Router();

router.use(express.static(path.join(__dirname, '/../public')));


//display all the products
router.get('/', function(req, res, next){
  Catagory.find(function(err, catagory){
    if(err) return next(err);
    //res.json(products);
    console.log(catagory);
    res.json(catagory);
  });
});

router.get('/id/:id', function(req, res, next){
  Catagory.find({ _id: req.params.id }, function(err, catagory){
    if(err) return console.log(err);
    //res.json(products);
    console.log(catagory);
    res.json({catagory: catagory});
  });
});

router.get('/parent/:id', function(req, res, next){
  Catagory.find({ parent: req.params.id }, function(err, catagory){
    if(err) return console.log(err);
    //res.json(products);
    console.log(catagory);
    res.json({catagory: catagory});
  });
});



module.exports = router;