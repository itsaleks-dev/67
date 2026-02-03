const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const exists = await User.findOne({
    email: email.toLowerCase().trim(),
  });

  if (exists) {
    return res.status(409).json({ message: "User already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    email: email.toLowerCase().trim(),
    passwordHash,
  });

  req.login(user, () => {
    res.status(201).json({
      message: "Registered and logged in",
      user: { id: user._id, email: user.email },
    });
  });
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({
    message: "Logged in",
    user: { id: req.user._id, email: req.user.email },
  });
});

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("sid");
      res.json({ message: "Logged out" });
    });
  });
});

module.exports = router;
