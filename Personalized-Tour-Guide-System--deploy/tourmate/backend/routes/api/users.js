const express = require("express");
const router = express.Router();
const usersController = require("../../controller/usersController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router.delete('/deleteUser/:user', usersController.deleteUser);
router.delete('/removeUserImage/:user', usersController.removeUserImage);
// router
//   .route("/")
//   .get(
//     verifyRoles(ROLES_LIST.User),
//     usersController.getAllUsers
//   )
//   .delete(verifyRoles(ROLES_LIST.User), usersController.deleteUser);

router.get('/getUser/:username',usersController.getUser);

router.put('/updateUsername/:user',usersController.updateUsername);
router.put('/updateUserpass/:user',usersController.updateUserpass);
router.put('/updateUserimage/:user',usersController.updateUserimage);
router.put('/updateUserEmail/:user',usersController.updateUserEmail);

// router
//   .route("/getUser/:username")
//   .get(
//     verifyRoles(ROLES_LIST.User),
//     usersController.getUser
//   );



module.exports = router;
