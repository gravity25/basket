var mongoose = require ('mongoose');
var Schema = mongoose.Schema;
 
var Schema= new Schema({
   user:{type:Schema.Types.ObjectId,ref:'user'},
   cart:{type:Object, required: true},
   name:{type:String, required: true},
   payment:{type: String, required: false},
   });
  
 
  module.exports= mongoose.model('Order',Schema);
