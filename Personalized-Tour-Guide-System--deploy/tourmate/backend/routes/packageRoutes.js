const express = require("express");
const router = express.Router();
const {
    addPlaceToPackage,
    getPackage,
} = require("../controller/packageController");
 console.log("route");

router.post('/addPlaceToPackage', addPlaceToPackage);
router.get("/getpackage/:userId", getPackage);


module.exports = router;