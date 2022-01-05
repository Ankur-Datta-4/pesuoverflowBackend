const mongoose=require("mongoose");


const DetailSchema=new mongoose.Schema({
    pId:{
        type:String,
        required:true
    },
    contact:String,
    photoURL:String,
    about:{
        type:[String]
    },
    history:{
        type:[String]
    }
})

module.exports=mongoose.model('Details',DetailSchema);