const mongoose=require("mongoose");

const DetailSchema=new mongoose.Schema({
    pId:{
        type:String,
        required:true
    },
    contact:{
        email:String,
        phone:String
    },
    photoURL:String,
    interests:{
        type:[String]
    },
    displayInfo:String
})


module.exports=mongoose.model('Details',DetailSchema);