var mongoose = require('mongoose');

var categorySchema = {
  _id: { type: String, unique: true },
  parent: {
    type: String,
    ref: 'Catagory'
  },
  ancestors: [{
    type: String,
    ref: 'Catagory'
  }]
};

var schema = new mongoose.Schema(catagorySchema);
var Catagory = mongoose.model('Catagory', schema);

module.exports= mongoose.model('Catagory',Schema);