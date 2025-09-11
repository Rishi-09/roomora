const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const { title } = require("process");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");



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


// root route
app.get("/",(req,res)=>{
    res.send("working");
})

//Index Route
app.get("/listings",async (req,res)=>{
    console.log("ok");
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

//Create Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/createListing");
})


//Show Route
app.get("/listings/:id", async (req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{ listing });
})

app.post("/listings",async (req,res)=>{
    let newListing = new Listing(req.body);
    await newListing.save();
    res.redirect("/listings");
} )

//Edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    console.log(listing);
    res.render("listings/edit", { listing });
})

app.put("/listings/:id", async (req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id,req.body);
    res.redirect(`/listings/${id}`);
})

//Delete route
app.delete("/listings/:id",async (req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})





// app.get("/testlisting",async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"My new Villa",
//         description :"by the beach",
//         price:1200,
//         location:"jalandhar",
//         country:"India"
//     });

//     await sampleListing.save();
//     console.log("saved");
//     res.send("done");
// })
app.listen(8080,(req,res)=>{
    console.log("http://localhost:8080")
})