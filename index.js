require("dotenv").config();
const express=require("express");
const {graphqlHTTP}=require("express-graphql");
//const schema=require("./schema/schemaSample");
const schema=require("./Queries");
const app=express();
const mongoose=require("mongoose");

app.use("/graphql",graphqlHTTP({
    //schema goes here
    schema,
    graphiql:true
}))     
function connectDb(url){
    
        return mongoose.connect(url,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
}
app.listen(process.env.PORT,async()=>{
    try{
        await connectDb(process.env.MONGO_URI);
        console.log("Listening at port 5000");

    }catch(err){
        console.log("Error COnnecting to DB");
        console.log(err);
    }
})