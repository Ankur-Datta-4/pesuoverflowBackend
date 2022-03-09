const mongoose=require("mongoose");

const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');
const ProjectSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    cid:{
        type:String,
        required:true
    },
    status:{
        statusNum:Number,
        statusLine:String
    },
    isActive:Boolean,
    managers:[String]
})

//everytime calculation of status is tedious
module.exports=mongoose.model("Project",ProjectSchema);