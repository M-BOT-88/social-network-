const mongoose = require('mongoose');

//const thingSchema = mongoose.Schema({
 // title: { type: String, required: true },
  //description: { type: String, required: true },
  //imageUrl: { type: String, required: true },
  //userId: { type: String, required: true },
 // price: { type: Number, required: true },
//});

//module.exports = mongoose.model('Thing', thingSchema);
const UserSchema=new mongoose.Schema({
  name:{
    type:String,
    required: true},
    email:{
      type:String,
 
      unique:true
    },
    password:{
      type:String,
      required:true
    }
  });
module.exports=User=mongoose.model('user',UserSchema);