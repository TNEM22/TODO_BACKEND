const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.use(authController.protect);

router
  .route("/")
  .get(authController.restrictTo("admin"), userController.getAllUsers);

router.route("/me").post(userController.getMe);

module.exports = router;
