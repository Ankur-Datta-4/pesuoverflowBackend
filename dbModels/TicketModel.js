const mongoose=require("mongoose");

const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');
//  Types of tickets
const TicketSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    type:String,
    header:{
        cid:String,
        pid:String
    },
    available:{
        type:Boolean,
        default:true
    },
    status:{
        statusNum:Number,
        statusLine:String,
    },
    deadline:Date,
    assignedBy:String,
    assignedTo:String,
    isRecent:{
        type:Boolean,
        default:false
    },
    shared:[String],
    stakeHolders:[String],
    relatedItems:[String],
    displayInfo:String,
    requirements:[String]
})

TicketSchema.plugin(mongoose_fuzzy_searching,{fields:["displayInfo","requirements","name"]})

module.exports=mongoose.model("Ticket",TicketSchema);