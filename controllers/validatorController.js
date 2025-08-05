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
      res.render("index", {
        title: "Home",
        errors: errors.array(),
        user: null,
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
  if (!req.user) {
    res.redirect("/");
    return;
  }
  next();
};
exports.postValidation = [
  body("title").notEmpty().withMessage("Title should not be empty."),
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
  body("firstname").notEmpty().withMessage("Firstname should be empty."),
  body("username")
    .notEmpty()
    .withMessage("Username should not be empty.")
    .custom(async (value) => {
      const username = await userStorage.checkUserName(value);
      if (username) throw new Error("Username already registered.");
    }),
  body("password").notEmpty().withMessage("Password should not be empty."),
  body("confirmpassword")
    .notEmpty()
    .withMessage("Confirmpassword should not be empty.")
    .custom(value, (req) => {
      if (value !== req.body.password)
        throw new Error("Password should be match.");
    }),
  (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
  },
];
