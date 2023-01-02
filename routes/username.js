const bcryptjs = require("bcryptjs");
const express = require("express");
const router = express.Router();
const saltRounds = 10;

const User = require("../models/User.model");

router.get("/profile/:username", (req, res) => {
  const { username } = req.params;

  User.findOne({ username })
    .then((foundUser) => res.render("profile", foundUser))
    .catch((err) => console.log(err));
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  bcryptjs
    .hash(password, saltRounds) // Generate a hash password
    .then((hash) => {
      return User.create({ username, password: hash }); // // Create a User in the DB, add the Hash password to the new user
    })
    .then((newUser) => res.redirect(`profile/${newUser.username}`)) // Redirect the user to their profile
    .catch((err) => console.log(err));
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  console.log(req.body);

  const { username, password } = req.body;

  User.findOne({ username })
    .then((foundUser) => {
      return bcryptjs.compare(password, foundUser.password).then((result) => {
        if (result) {
          res.redirect(`/profile/${foundUser.username}`);
        } else {
          res.render("login", {
            errorMessage: "Incorrect password, try again",
          });
        }
      });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
