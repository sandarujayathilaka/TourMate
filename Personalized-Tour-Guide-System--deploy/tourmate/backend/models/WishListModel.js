const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wishListSchema = new Schema({

    userId: {
      type: String,
      required: true,
    },
    placeName:{
      type:String,
    },
    placeName2: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    },
    note:{
      type:String
    }
   
  });
  
  module.exports = mongoose.model("WishList", wishListSchema);