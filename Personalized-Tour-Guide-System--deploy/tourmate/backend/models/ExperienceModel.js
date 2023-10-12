const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const experienceSchema = new Schema({
  topic: {
    type: String,
    required: [true, "Please add a topic"],
  },

  userName: {
    type: String,
    required: [true, "Please add a name"],
  },

  location: {
    type: String,
    required: [true, "Please add a location"],
  },

  image: {
    type: String,
    required: [true, "Please add a image"],
  },

  description: {
    type: String,
    required: [true, "Please add a description"],
  },

  

});

module.exports = mongoose.model('Experience', experienceSchema);
