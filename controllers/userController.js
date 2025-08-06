const userStorage = require("../database/dbQuery");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
let history = [];
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await userStorage.getUser(username, null);

      if (!user) return done(null, false, { message: "Username not found." });

      if (!bcrypt.compare(user.password, password))
        return done(null, false, { message: "Password incorrect." });

      done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userStorage.getUser(null, id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
exports.index = async (req, res) => {
  const posts = await userStorage.getPosts(req.user ? req.user.tier : null);

  res.render("index", {
    title: "Home",
    errors: [],
    posts: posts.rows,
  });
};
exports.signupPage = (req, res) => {
  res.render("signup", { title: "Sign Up" });
};
exports.signup = async (req, res) => {
  const { firstname, lastname, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await userStorage.insertUser(
    firstname,
    lastname,
    username,
    hashedPassword,
    3
  );
  res.send({ msg: "success" });
};
exports.signout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};
exports.memberUpgrade = async (req, res) => {
  res.render("memberPage", {
    title: "Membership",
  });
};
exports.memberUpgradePost = async (req, res) => {
  await userStorage.updateMembership(req.user.id, 2);
  res.send({
    msg: "Congrats of becoming a member. You will be redirected shortly.",
  });
};
exports.createPage = async (req, res) => {
  res.render("createPostPage", { title: "Create" });
};
exports.createPost = async (req, res) => {
  const timeStamp = new Date();
  const { title, postcontent } = req.body;
  console.log(title, postcontent);
  await userStorage.createPost(title, postcontent, timeStamp, req.user.id);
  res.send({ msg: "Created" });
};
exports.viewPost = async (req, res) => {
  const { id, title } = req.params;
  const post = await userStorage.findPostById(id);
  if (history.find((val) => val.id === id)) {
    if (history.length >= 5 && !history.find((val) => val.id === id)) {
      history.pop();
      history.unshift({ title, id });
    }
  } else {
    history.push({ title, id });
  }
  console.log(post);
  res.render("viewPost", { title: title, posts: post });
};
