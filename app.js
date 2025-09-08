const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const { title } = require("process");



main()
.then(res=>console.log("connection successfull"))
.catch(err=>console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/roomora");
}
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.get("/",(req,res)=>{
    res.send("working");
})

app.get("/listings",async (req,res)=>{
    console.log("ok");
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});





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