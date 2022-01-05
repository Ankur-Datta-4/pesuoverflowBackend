const mongoose=require("mongoose");


const ClubSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    picGallery:[String],
    testimonials:[String],
    news:[String],
})

module.exports=mongoose.model("Club",ClubSchema);