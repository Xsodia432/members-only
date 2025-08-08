const userStorage = require("../database/dbQuery");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await userStorage.getUser(username, null);
      if (!user) return done(null, false, { message: "Username not found." });
      const match = await bcrypt.compare(password, user.password);
      console.log(match);
      if (!match) return done(null, false, { message: "Password incorrect." });

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
  const posts = await userStorage.getPosts();

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

  await userStorage.createPost(title, postcontent, timeStamp, req.user.id);
  res.send({ msg: "Created" });
};
exports.viewPost = async (req, res) => {
  const { id, title } = req.params;
  const post = await userStorage.findPostById(id);
  res.render("viewPost", { title: title, posts: post });
};
exports.deletePost = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  await userStorage.deletePostById(id);
  res.redirect("/");
};
exports.getSignIn = (req, res) => {
  res.render("signin", { title: "Sign In", errors: [] });
};
