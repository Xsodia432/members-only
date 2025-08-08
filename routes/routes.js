const { Router } = require("express");
const userController = require("../controllers/userController");
const router = Router();
const passport = require("passport");
const validation = require("../controllers/validatorController");

router.get("/", userController.index);
router.get("/sign-up", userController.signupPage);
router.post("/signup", validation.signInField, userController.signup);
router.post("/signout", userController.signout);
router.post("/signin", validation.loginInput, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    //check if user successfully authenticated
    if (!user)
      return res.render("signin", {
        title: "Sign In",
        errors: [{ msg: info.message || "Login Failed" }],
        posts: null,
      });
    req.login(user, (err) => {
      if (err) next(err);
      return res.redirect("/");
    });
  })(req, res, next);
});

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
router.get(
  "/post/:id/:title",

  userController.viewPost
);
router.post("/delete/:id", userController.deletePost);
module.exports = router;
router.get("/sign-in", userController.getSignIn);
