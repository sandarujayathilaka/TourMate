const express = require("express");
const router = express.Router();
const {
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
} = require("../controller/favouritePlaceController");
console.log("route");
router.get("/getallplaces/:userid", getAllPlaces);
router.post("/addfavplace", addFavPlace);
router.delete("/deleteplace/:id", deletePlace);
router.put("/updateplace/:id", updatePlace);
router.get("/getlocationplaces/:userid", getAllLocationPlaces);
router.get("/getallvisitedplaces/:userid", getAllVisitedPlaces);
router.get("/gethidden", getHiddenPlaces);
router.get("/gethiddenspecific/:userid", getHiddenSpecificUser);
router.get("/getanyplace/:id", getAnyPlace);
router.get("/getplacecount/:userId", getPlaceCategoryCount);
router.get("/getplacetypecount/:userId", getPlaceTypeCount);
module.exports = router;
