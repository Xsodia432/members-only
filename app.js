const express = require("express");
const routes = require("./routes/routes");
const pool = require("./database/dbCon");
const passport = require("passport");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
require("dotenv/config");
const path = require("node:path");
const assetsPath = path.join(__dirname, "public");
const app = express();
const { format, formatDistanceToNow } = require("date-fns");

app.use(
  session({
    store: new pgSession({
      pool: pool,
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 1000 * 60 * 1000,
    },
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(passport.session());
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  res.locals.helpers = {
    formatDate: (date) => format(date, "MMMM dd, yyyy"),
    timeAge: (date) => formatDistanceToNow(date, { addSuffix: true }),
    user: {
      userName: req.user ? req.user.username : null,
      firstName: req.user ? req.user.first_name : null,
      lastName: req.user ? req.user.last_name : null,
      tier: req.user ? req.user.tier : null,
      userId: req.user ? req.user.id : null,
      isSignedIn: req.user ? true : false,
    },
  };
  console.log(res.locals.helpers);
  next();
});

app.use("/", routes);
app.use("/{*splat}", routes);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send(err);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express Host Listening ${PORT}`));
