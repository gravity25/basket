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
var Products = mongoose.model('Products', schema);

module.exports = Products;
