const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");


module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderCreate = (req, res) => {
  res.render("listings/createListing");
};

module.exports.show = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", " Listing Does Not Exist!");
    res.redirect("/listings");
  } else {
    res.render("listings/show.ejs", { listing });
  }
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let newListing = new Listing(req.body);
  newListing.owner = req.user._id;
  newListing.image = { url,filename };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEdit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  let originalUrl = listing.image.url;
  if (!listing) {
    req.flash("error", " Listing Does Not Exist!");
    res.redirect("/listings");
  } else {
    res.render("listings/edit.ejs", { listing,originalUrl });
  }
};

module.exports.editListing = async (req, res) => {
  let result = listingSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, `${result.error}`);
  }
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, req.body);
  if(typeof req.file!=="undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url,filename};
  await listing.save()
  };
  req.flash("success", " Listing Edited!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", " Listing Deleted!");
  res.redirect("/listings");
};
