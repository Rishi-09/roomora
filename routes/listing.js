const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const {
  index,
  show,
  createListing,
  editListing,
  deleteListing,
  renderCreate,
  renderEdit,
} = require("../controller/listings.js");




//Index Route and Create Listing
router.route("/")
  .get(wrapAsync(index))
  .post(isLoggedIn, validateListing,upload.single("image"), wrapAsync(createListing));

//Render Create Listing Form
router.route("/new").get(isLoggedIn, renderCreate);

// Show, Edit and Delete Listing
router.route("/:id")
  .get(wrapAsync(show))
  .put(isLoggedIn, isOwner, wrapAsync(editListing))
  .delete(isLoggedIn, isOwner, wrapAsync(deleteListing));

//Render Edit form
router.route("/:id/edit").get(
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(renderEdit)
);

module.exports = router;
