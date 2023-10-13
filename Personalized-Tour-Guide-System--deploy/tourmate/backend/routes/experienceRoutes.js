const express = require("express");

const router = express.Router();
const {
  readExperience,
  addExperience,
  updateExperience,
  deleteExperience,
  getOneExperience,
  getExperiencesByCurrentUser,
  
} = require("../controller/experienceController");
/*const {
  protect,
  userProtect,
  adminProtect,
} = require("../middleware/authMiddleware");*/

router.get("/", readExperience);
router.post("/", addExperience);
router.put("/:id", updateExperience);
router.delete("/:id",deleteExperience );
router.get("/:id",getOneExperience );
router.get("/myexperiences/:user",getExperiencesByCurrentUser );
module.exports = router;