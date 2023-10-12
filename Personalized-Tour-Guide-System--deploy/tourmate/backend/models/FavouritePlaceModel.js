const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favPlaceSchema = new Schema({
  placeName: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  visitedDate: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  latitude: {
    type: String,
    required: false,
  },
  longitude: {
    type: String,
    required: false,
  },
  placeType: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("FavouritePlace", favPlaceSchema);
