const favouritePlace = require("../models/FavouritePlaceModel");
const mongoose = require("mongoose");

const getHiddenPlaces = async (req, res) => {
  const cate = "Hidden Place";
  console.log(cate);
  try {
    const place = await favouritePlace.find({ category: cate });
    res.status(200).json({ place });
  } catch (error) {
    console.error("An error occurred:", error); // Log the error for debugging
    res
      .status(500)
      .json({ error: "place not found", errorMessage: error.message });
  }
};

const getAllVisitedPlaces = async (req, res) => {
  const userid = req.params.userid;

  try {
    const places = await favouritePlace
      .find({ userId: userid })
      .select("-image");
    // Use .select('-image') to exclude the 'image' field from the result

    res.status(200).json({ places });
  } catch (error) {
    console.error("An error occurred:", error);
    res
      .status(500)
      .json({ error: "place not found", errorMessage: error.message });
  }
};

const getAnyPlace = async (req, res) => {
  const id = req.params.id;
  try {
    const place = await favouritePlace.find({ _id: id });
    res.status(200).json({ place });
  } catch (error) {
    console.error("An error occurred:", error); // Log the error for debugging
    res
      .status(500)
      .json({ error: "place not found", errorMessage: error.message });
  }
};

const getHiddenSpecificUser = async (req, res) => {
  const userId = req.params.userid;
  const cate = "Hidden Place";
  console.log(cate);
  try {
    const place = await favouritePlace.find({ category: cate, userId: userId });
    res.status(200).json({ place });
  } catch (error) {
    console.error("An error occurred:", error); // Log the error for debugging
    res
      .status(500)
      .json({ error: "place not found", errorMessage: error.message });
  }
};

//-----get all places for specific user----

const getAllPlaces = async (req, res) => {
  try {
    const userId = req.params.userid;
    const categoriesToFetch = ["Favourite Place", "Favourite Hotel"];

    // Retrieve all the places and hotels related to the specific user and categories
    const place = await favouritePlace.find({
      userId: userId,
      category: { $in: categoriesToFetch },
    });

    res.status(200).json({ place });
  } catch (error) {
    console.error("An error occurred:", error); // Log the error for debugging
    res.status(500).json({
      error: "Places and hotels not found",
      errorMessage: error.message,
    });
  }
};

const addFavPlace = async (req, res) => {
  try {
    var hidden = "Hidden Place";
    var placeFavourite = "Favourite Place";
    var placeFavouriteHottel = "Favourite Hotel";

    console.log(req.body.userId);

    const existingHiddenPlace = await favouritePlace.findOne({
      placeName: req.body.placeName,
      location: req.body.location,
      category: hidden,
    });

    const existingFavouritePlace = await favouritePlace.findOne({
      placeName: req.body.placeName,
      location: req.body.location,
      userId: req.body.userId,
      category: placeFavourite,
    });

    const existingFavouriteHottel = await favouritePlace.findOne({
      placeName: req.body.placeName,
      location: req.body.location,
      userId: req.body.userId,
      category: placeFavouriteHottel,
    });

    if (existingFavouritePlace && req.body.category == "Favourite Place") {
      // If a place with the same location and name exists, return an error message
      return res
        .status(400)
        .json({ exsisterror: "Place already exists as a favourite" });
    }

    if (existingHiddenPlace && req.body.category == "Hidden Place") {
      // If a place with the same location and name exists, return an error message
      return res
        .status(400)
        .json({ exsisterror: "Place already exists Inside Hidden Places" });
    }

    if (existingFavouriteHottel && req.body.category == "Favourite Hotel") {
      // If a place with the same location and name exists, return an error message
      return res
        .status(400)
        .json({ exsisterror: "Hottel already exists as a favourite" });
    }

    //add new place
    const newPlace = new favouritePlace({
      placeName: req.body.placeName,
      userId: req.body.userId,
      category: req.body.category,
      visitedDate: req.body.visitedDate,
      location: req.body.location,
      contact: req.body.contact,
      image: req.body.image,
      description: req.body.description,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      placeType: req.body.placeType,
    });

    // Save the new place to the database
    await newPlace.save();
    res.status(201).json({ message: "Place is added", addedPlace: newPlace });
  } catch (error) {
    console.error("An error occurred:", error); // Log the error for debugging
    res
      .status(500)
      .json({ error: "Failed to add Place", errorMessage: error.message });
  }
};

//------delete tasks------

const deletePlace = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the profile exists
    const deletedPlace = await favouritePlace.findOne({ _id: id });
    if (!deletedPlace) {
      return res.status(404).json({ error: "place not found" });
    }
    // Delete the profile
    await favouritePlace.findOneAndDelete({ _id: id });

    return res
      .status(200)
      .json({ message: "Task deleted successfully", deletedPlace });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

//update place details

const updatePlace = async (req, res) => {
  const { id } = req.params;
  const {
    newPlaceName,
    newUserId,
    newCategory,
    newVisitedDate,
    currentLocation,
    newLocation,
    newContact,
    newImage,
    newDescription,
    newPlaceType,
  } = req.body;

  const updateData = {
    placeName: newPlaceName,
    userId: newUserId,
    category: newCategory,
    visitedDate: newVisitedDate,
    location: newLocation || currentLocation,
    contact: newContact,
    image: newImage,
    description: newDescription,
    placeType: newPlaceType,
  };

  try {
    const updatePlace = await favouritePlace.findOne({ _id: id });

    if (!updatePlace) {
      return res.status(404).send({ error: "Place is not found" });
    }

    await favouritePlace.findOneAndUpdate({ _id: id }, updateData);

    // Return success response
    res.status(200).send({ status: "place details updated" });
  } catch (err) {
    res.status(500).send({ error: "Internal server error" });
  }
};

const getAllLocationPlaces = async (req, res) => {
  try {
    const userId = req.params.userid;
    const { lat, lon, radius } = req.query;
    const radiusInMeters = parseFloat(radius);

    // Convert radius to radians (MongoDB requires radians)
    const radiusInRadians = radiusInMeters / 6371000; // Earth's radius in meters

    // Perform a radius-based search using $geoWithin and $centerSphere
    const places = await favouritePlace.find({
      userId: userId,
      latitude: {
        $gte: parseFloat(lat) - 10000 / 111325, // Latitude degrees per meter
        $lte: parseFloat(lat) + 10000 / 111325, // Latitude degrees per meter
      },
      longitude: {
        $gte: parseFloat(lon) - 10000 / 111325, // Latitude degrees per meter
        $lte: parseFloat(lon) + 10000 / 111325, // Latitude degrees per meter
      },
    });
    console.log("s");
    console.log(places);
    res.status(200).json({ places });
  } catch (error) {
    console.error("An error occurred:", error); // Log the error for debugging
    res
      .status(500)
      .json({ error: "Failed to fetch Place", errorMessage: error.message });
  }
};

const getPlaceCategoryCount = async (req, res) => {
  const userId = req.params.userId; // Assuming you're passing the user ID as a parameter
  console.log(userId);

  try {
    const categoryCounts = await favouritePlace.aggregate([
      {
        $match: { userId: userId }, // Filter by user ID
      },
      {
        $group: {
          _id: {
            $replaceOne: {
              input: "$category",
              find: " ", // Find a space
              replacement: "", // Replace with no space (empty string)
            },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {};

    categoryCounts.forEach((item) => {
      // Use the category name without spaces as the key
      result[item._id] = item.count;
    });

    console.log(result);

    res.status(200).json(result);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({
      error: "Failed to fetch category counts",
      errorMessage: error.message,
    });
  }
};

const getPlaceTypeCount = async (req, res) => {
  const userId = req.params.userId; // Assuming you're passing the user ID as a parameter
  console.log(userId);
  try {
    const categoryCounts = await favouritePlace.aggregate([
      {
        $match: { userId: userId }, // Filter by user ID
      },
      {
        $group: {
          _id: "$placeType",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 }, // Sort in descending order by count
      },
    ]);

    if (categoryCounts.length > 0) {
      const mostCommonCategory = categoryCounts[0]._id;
      res.status(200).json({ mostCommonCategory });
    } else {
      res.status(200).json({ mostCommonCategory: "No data available" });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({
      error: "Failed to fetch category counts",
      errorMessage: error.message,
    });
  }
};

module.exports = {
  getAllPlaces,
  addFavPlace,
  deletePlace,
  updatePlace,
  getAllLocationPlaces,
  getHiddenPlaces,
  getHiddenSpecificUser,
  getAnyPlace,
  getPlaceCategoryCount,
  getPlaceTypeCount,
  getAllVisitedPlaces,
};
