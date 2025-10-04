const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const { title } = require("process");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");


main()
.then(res=>console.log("connection successfull"))
.catch(err=>console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/roomora");
}
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const validateListing = (req,res,next) =>{
    let { error } = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error)
    }
    else{
        next(error);
    }
}


const validateReview = (req,res,next) =>{
    let { error } = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error)
    }
    else{
        next(error);
    }
}

// root route
app.get("/",wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//Index Route
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));


app.get("/listings/new",(req,res)=>{
    res.render("listings/createListing");
})


//Show Route
app.get("/listings/:id", wrapAsync(async (req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{ listing });
}));

//Create Route
app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{
    let newListing = new Listing(req.body);
    await newListing.save();
    res.redirect("/listings");
}));

//Edit route
app.get("/listings/:id/edit", validateListing,wrapAsync(async (req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("/listings/edit", { listing });
}));

app.put("/listings/:id", wrapAsync(async (req,res)=>{
    let result = listingSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(400,`${result.error}`);
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id,req.body);
    res.redirect(`/listings/${id}`);
}));



//Review Route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`,);
}));


//Delete route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


//Delete Review Route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))


app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!"}=err;
    res.status(statusCode).render("Error.ejs",{ message }); 
    // res.status(statusCode).send(message);
})

app.listen(8080,(req,res)=>{
    console.log("http://localhost:8080")
})