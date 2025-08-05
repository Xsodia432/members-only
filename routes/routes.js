const { Router } = require("express");
const userController = require("../controllers/userController");
const router = Router();
const passport = require("passport");
const validation = require("../controllers/validatorController");

router.get("/", userController.index);
router.get("/signup", userController.signupPage);
router.post("/signup", validation.signInField, userController.signup);
router.post("/signout", userController.signout);
router.post(
  "/signin",
  validation.loginInput,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

router.get(
  "/membership",
  validation.checkMembership,
  userController.memberUpgrade
);
router.post(
  "/membership",
  validation.answerValidation,
  userController.memberUpgradePost
);
router.get("/create", validation.checkIfLogin, userController.createPage);
router.post("/create", validation.postValidation, userController.createPost);
router.get("/post/:id/:title", validation.checkIfLogin);
module.exports = router;
