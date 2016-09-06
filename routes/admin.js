var express = require('express'),
    User = require('./../models/user.js'),
    Products = require('./../models/product.js'),
    fs = require('fs');
    path = require('path');

var router = express.Router();
router.use(express.static(path.join(__dirname, '/../public')));

var multer = require('multer');
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});
var upload = multer({ storage : storage}).single('products');


router.use('/', AdminLoggedIn, function(req, res, next){
  next();
});

router.get('/', function(req, res, next){
  //res.json({"error": false, "message": "Welcome Admin!"});
  res.render('admin.ejs', {user: req.user, msg: ""});
});

//create products
// router.post('/addProduct',  function(req, res, next) {

// var messages = [];

//    upload(req,res,function(err) {
//         if(err) {
//             return res.end("Error uploading file.");
//         }
//         //res.end("File is uploaded");
//         //console.log(req.file);
//         else{
//         fs.readFile(req.file.path, function(err, data){
//           if(err){
//             return console.log(err);
//           }
//           else{

//            var s = data.toString(); //convert buffer to array of string
//            var items = JSON.parse(s);
//            //console.log(items);




//            // for (var i=0; i<items.length; i++){
//            //    console.log(items[i].title);
//            //  s}


//           for (var i=0; i<items.length; i++){
//             Products.findOne({ 'title': items[i].title }, function(err, product){
//               if(err){
//                 return next(err);
//               }
//               if(product){
//                 messages.push({'title': items[i].title, 'message':'already exist!'});
//               }
//               else {
//                 Products.create(product, function (err, post) {
//                   if (err) messages.push({'title': items[i].title, 'message': err});
//                   messages.push({'title': items[i].title, 'message': 'succesfully uploaded'});
//                 });
//               }
//             });
//           }
//           console.log(messages);
//           res.render('admin.ejs', {messages: messages});
//           }
//         });
//       }

//     });


//   // console.log(messages);

// });


// router.get('/product', function(req, res, next){
//   var title = req.query.title;
//   console.log(typeof(title));

//   Products.find().where("title", "Dell Inspiron 15 3542 Notebook").exec(function(err, product) {
//     if (err) {
//       return console.log(err);
//     }
//     // if(product){
//     //   res.render('admin_products.ejs', {product: product});
//     // }
//     // else{
//     //   res.render('admin.ejs', {msg: "product does not exist"});
//     // }
//     console.log(product);
//   });
//   res.redirect('/admin');

// });


//upadta a product by ID

//get product
router.get('/updateProduct', function(req, res, next){
  res.render('admin_updateproduct.ejs', {product: null, user: req.user});
});

router.post('/updateProduct', function(req, res, next) {
  Products.findOne({title: req.body.title}, function(err, product) {
    if (err) {
      return next(err);
    }
    console.log(product);
    res.render('admin_updateproduct.ejs', {product: product, user: req.user});
  });
});
//update the product
router.post('/updateProduct/:id', function(req, res, next) {
  Products.findByIdAndUpdate({ _id: req.params.id }, req.body, function(err, product) {
    if (err) {
      return next(err);
    }
    console.log(req.body);
    //res.render('admin_updateproduct.ejs', {product: product, user: req.user});
    res.redirect('/admin/updateProduct');
  });
});

//add a product
router.get('/addProduct', function(req, res, next){
  res.render('admin_addProduct.ejs', {product: null, msg: "Fill Product Details:", user: req.user});
});

router.post('/addProduct', function(req, res, next) {
  Products.findOne({title: req.body.title}, function(err, product) {
    if (err) {
      console.log("Error in finding the product");
      return next(err);
    }
    if(!product){
      Products.create(req.body, function (err, product) {
        if (err) return next(err);
        res.render('admin_addProduct.ejs', {product: product, msg:"Product added succesfully", user: req.user});
      });
    }
    else{
      console.log(product);
      res.render('admin_addProduct.ejs', {product: product, msg: "Product with this title already exist!", user: req.user});
    }
    
  });
});

//delete a product by ID
// router.delete('/deleteProduct/:id', function(req, res, next){
//   Products.findByIdAndRemove(req.params.id, req.body, function(err, post){
//     if(err) return next(err);
//     res.json(post);
//   });
// });


router.get('/user', function(req, res, next){
  User.find(function(err, users){
    if(err) return next(err);
    // res.json(user);
    console.log(users);
    res.render('admin_users.ejs', {user: req.user, users: users});
  });
});


// router.get('/user/:id', function(req, res, next){
//  User.findById(req.params.id, function(err, user){
//    if(err) return next(err);
//    res.json(user);
//  });
// });

// //delete a user by ID
// router.delete('/user/:id', function(req, res, next){
//   User.findByIdAndRemove(req.params.id, req.body, function(err, post){
//     if(err) return next(err);
//     res.json(post);
//   });
// });


// router.put('/user/:id', function(req, res, next) {
//   User.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
//     if (err) return next(err);
//     res.json(post);
//   });
// });

module.exports = router;

function AdminLoggedIn(req, res, next){
  if (req.isAuthenticated() && (req.user.user_id=='varuns@123' || req.user.user_id=='garvit@123')){
    return next();
  };
  res.redirect('/');
}
