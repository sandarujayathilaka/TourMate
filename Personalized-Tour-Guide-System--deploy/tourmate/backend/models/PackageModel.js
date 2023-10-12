const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PackageSchema =new Schema({

  //  packageName:{
  //   type:String
  //  },
    userId: {
        type: String,
        required: true,
      },
    selectedPlaces: [
        {
          placeName: { type: String, required: true },
          location: {type:String},
          image:{type:String},
          description:{type:String}
        },
      ],
  });
module.exports = mongoose.model("UserPackage", PackageSchema);
