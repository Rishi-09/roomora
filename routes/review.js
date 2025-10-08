const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");
const { deleteReview, postReview } = require("../controller/review.js");

//Review Route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(postReview)
);

//Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapAsync(deleteReview)
);

module.exports = router;
