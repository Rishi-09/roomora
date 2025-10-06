 const mongoose = require("mongoose");
 const initData = require("./data");
 const Listing = require("../models/listing");
const { init } = require("../models/listing");


 main()
 .then(res=>console.log("connection successfull"))
 .catch(err=>console.log(err));
 
 async function main() {
     await mongoose.connect("mongodb://127.0.0.1:27017/roomora");
 }
 
 const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"68e263826ff6b59206fcfdce"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
 }

 initDB(); 