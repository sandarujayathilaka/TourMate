// controllers/packageController.js
const UserPackage = require("../models/PackageModel");


//add places to package
const addPlaceToPackage = async (req, res) => {
  try {
    const { userId, selectedPlace } = req.body;

    // Find the user's package
    // const userPackage = await UserPackage.findOne({ userId });

    if (!userPackage) {
      // If the user doesn't have a package, create a new one
      const newUserPackage = new UserPackage({
        userId,
        selectedPlaces: [selectedPlace],
      });
      await newUserPackage.save();
      res.json({ message: "Place added to the package", package: newUserPackage });
    } else {
      // Update the user's package with the new selected place
      userPackage.selectedPlaces.push(selectedPlace);
      await userPackage.save();
      res.json({ message: "Place added to the package", package: userPackage });
    }
  } catch (error) {
    console.error("Error adding place to package:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//get package details
const getPackage = async (req, res) => {
  try {
    const userId = req.params.userId;

    const userPackage = await UserPackage.findOne({ userId });

    if (!userPackage) {
      res.status(404).json({ message: "Package not found for the user" });
    } else {
      res.json({ package: userPackage });
    }
  } catch (error) {
    console.error("Error fetching user's package:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




module.exports={
    addPlaceToPackage,
    getPackage,
};
