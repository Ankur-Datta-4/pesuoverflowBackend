const mongoose=require("mongoose");
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');

const ClubSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    picGallery:[{
        caption:String,
        uri:String
    }],
    wallOfFame:[String]
})


module.exports=mongoose.model("Club",ClubSchema);