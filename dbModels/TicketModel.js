const mongoose=require("mongoose");


//  Types of tickets
//  create-bug fixes-research-build
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
        default:false
    },
    statusNum:Number,
    statusLine:String,
    deadLine:Date,
    assignedBy:String,
    assignedTo:String,
    stakeHolders:[String],
    relatedItems:[String]
})


module.exports=mongoose.model("Ticket",TicketSchema);