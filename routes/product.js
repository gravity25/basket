var express = require('express'),
    Products = require('./../models/product.js');
    path = require('path');

var router = express.Router();

router.use(express.static(path.join(__dirname, '/../public')));


router.get('/', function(req, res, next){
  Products.find(function(err, products){
    if(err) return next(err);
    //res.json(products);
    //console.log(products)
    res.render('products.ejs', {products: products, user: req.user });
  });
});


router.get('/catagory/:name', function(req, res, next){
  Products.find({catagory: req.params.name}, function(err, products){
    if(err) return next(err);
    //res.json(products);
    console.log(req.params);
    console.log(products);
    res.render('products.ejs', {products: products, user: req.user });
  });
});

//display products by ID
router.get('/:id', function(req, res, next){
	Products.findById(req.params.id, function(err, item){
		if(err)	return next(err);
		//res.json(item);
          res.render('item.ejs', {item: item, user: req.user });
	});
});

module.exports = router;
