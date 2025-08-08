const { body, validationResult } = require("express-validator");
const userStorage = require("../database/dbQuery");
// validation for inputs and others
exports.loginInput = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username should not be empty."),
  body("password").notEmpty().withMessage("Password should not be empty."),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("signin", {
        title: "Sign In",
        errors: errors.array(),
      });
      return;
    }
    next();
  },
];
exports.answerValidation = [
  body("membership").notEmpty().withMessage("Answer should not be empty."),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.send({ errors: errors.array() });
        return;
      }
      if (req.body.membership.toLowerCase() !== req.body.answer.toLowerCase()) {
        res.send({ errors: [{ msg: "Incorrect Answer." }] });
        return;
      }
      next();
    } catch (err) {
      console.log(err);
    }
  },
];
exports.checkMembership = (req, res, next) => {
  if (!req.user || req.user.tier !== 2) {
    res.redirect("/");
    return;
  }
  next();
};
exports.checkIfLogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect("/");
    return;
  }
  next();
};
exports.postValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title should not be empty.")
    .isLength({ min: 5, max: 255 })
    .withMessage("Title should be between 5 and 255 long."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send({ errors: errors.array() });
      return;
    }
    next();
  },
];
exports.signInField = [
  body("firstname")
    .notEmpty()
    .withMessage("Firstname should not be empty.")
    .isLength({ min: 1, max: 80 })
    .withMessage("Lastname should be between 1 and 80 long."),
  body("lastname")
    .optional({ checkFalsy: true })
    .isLength({ min: 1, max: 80 })
    .withMessage("Lastname should be between 1 and 80 long."),
  body("username")
    .notEmpty()
    .withMessage("Username should not be empty.")
    .isLength({ min: 5, max: 80 })
    .withMessage("Username should be between 5 and 80 long.")
    .custom(async (value) => {
      const username = await userStorage.findUserByUserName(value);
      if (username.length > 0) {
        throw new Error("Username already registered.");
      }
    }),
  body("password").notEmpty().withMessage("Password should not be empty."),
  body("confirmpassword")
    .notEmpty()
    .withMessage("Confirmpassword should not be empty.")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password don't match");
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.send({ errors: errors.array() });
      return;
    }
    next();
  },
];
