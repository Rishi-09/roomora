const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

main()
.then(res=>console.log("connection successfull"))
.catch(err=>console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/roomora");
}

app.get("/",(req,res)=>{
    res.send("working");
})

app.listen(8080,(req,res)=>{
    console.log("http://localhost:8080")
})