const mongoose=require("mongoose");


const ProjectSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    cid:{
        type:String,
        required:true
    },
    picGallery:[String],
    testimonials:[String],
    news:[String],
    statusNum:Number,
    statusLine:String
})

//everytime calculation of status is tedious

module.exports=mongoose.model("Project",ProjectSchema);