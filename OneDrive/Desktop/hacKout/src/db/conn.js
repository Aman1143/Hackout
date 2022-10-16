const mongoose=require('mongoose');

mongoose.connect("mongodb://localhost:27017/libdata").then(()=>{
    console.log("Connection successfull..");
}).catch(()=>{
    console.log("Error occured...")
})


