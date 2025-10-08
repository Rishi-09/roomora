const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const { signup, login, logout, renderSignup, renderlogin } = require("../controller/user");

router.get("/signup", renderSignup);

router.post("/signup", wrapAsync(signup));

router.get("/login", renderlogin);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  login
);

router.get("/logout", logout);

module.exports = router;
