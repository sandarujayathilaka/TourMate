const express = require("express");
const router = express.Router();
const {
    fetchPlaces,
  
} = require("../controller/placesFetchingController");
 console.log("route");

router.post('/fetchPlaces', fetchPlaces);

module.exports = router;