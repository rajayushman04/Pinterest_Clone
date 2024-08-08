
var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require('passport');
const upload = require("./multer");
const localStrategy = require("passport-local");

// // Middleware for sessions and passport
const session = require('express-session');
router.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());

passport.use(new localStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/feed', function(req, res, next) {
  res.render('feed');
});
router.post('/upload', isLoggedIn, upload.single("file"), async function(req, res, next) {
  if(!req.file){
    return res.status(404).send("No Files Were Given");
  }
  const user = await userModel.findOne({username: req.session.passport.user});
  const post = await postModel.create({
    Image: req.file.filename,
    imageText: req.body.filecaption,
    user: user._id
  })
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});

router.get('/login', function(req, res, next) {
  res.render('login',{error: req.flash('error')});
});

router.get('/profile', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  .populate("posts")
  res.render("profile",{user});
});

router.post("/register", function(req, res) {
  const userData = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullName: req.body.fullName
  });

  userModel.register(userData, req.body.password)
    .then(function() {
      passport.authenticate("local")(req, res, function() {
        console.log("User registered and authenticated");
        res.redirect("/profile");
      });
    })
    .catch(function(err) {
      console.log("Error during registration:", err);
      res.redirect("/");
    });
});

router.post("/login", function(req, res, next) {
  passport.authenticate("local", { failureFlash: true }, function(err, user, info) {
    if (err) {
      console.log("Error during authentication:", err);
      return next(err);
    }
    if (!user) {
      console.log("Authentication failed:", info.message);
      req.flash('error', info.message); // Store the flash message
      return res.redirect('/login'); // Redirect to login page to show the flash message
    }
    req.logIn(user, function(err) {
      if (err) {
        console.log("Error during login:", err);
        return next(err);
      }
      console.log("User authenticated and logged in");
      return res.redirect('/profile');
    });
  })(req, res, next);
});

router.get("/logout", function(req, res, next) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}

module.exports = router;
