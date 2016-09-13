var mongoose = require('mongoose');
//var Category = require('./catagory');

var productSchema = {
  title: { type: String, required: true },
  // image_url must start with "http://"
  image_url: [{ type: String, match: /^http(s?):\/\//i }],
  price: { type: Number, required: true },
  overview: { type: String, required: true },
  catagory: {type:String}
};

var schema = new mongoose.Schema(productSchema);


//Creating index
schema.index({title: 1});

//Mongoose automatically calls ensureIndex for each defined index in your schema.
//Mongoose will call ensureIndex for each index sequentially,
//and emit an 'index' event on the model when all the ensureIndex calls succeeded
//or when there was an error.
schema.on('index', function (err) {
  if (err) console.error(err); // error occurred during index creation
})

// // it is recommended this behavior be disabled in production
// //since index creation can cause a significant performance impact
// schema.set('autoIndex', false);  

var Products = mongoose.model('Products', schema);

module.exports = Products;
