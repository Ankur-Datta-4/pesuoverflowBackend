const mongoose=require("mongoose");


const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');
//3 types of users
//student-mentor-proffesor

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    type:{
        type:String
    },
    points:{
        type:Number,
        default:0
    },
    email:{
        type:String,
        unique:true
    }
})
const PositionSchema=new mongoose.Schema({
    uid:{
        type:String,
        required:true
    },
    pid:String,
    cid:String,
    post:{
        type:String,
        default:"member"
    }
})

const UserModel=mongoose.model("User",UserSchema);
const PositionModel=mongoose.model("Position", PositionSchema);
module.exports={
    UserModel,
    PositionModel
}


