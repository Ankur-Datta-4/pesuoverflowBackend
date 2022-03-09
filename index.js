require("dotenv").config();

//const {ApolloServer,gql}=require("apollo-server")
const {ApolloServer} =require("apollo-server-express");
const mongoose=require("mongoose");
const express=require("express");
const cors=require("cors");

const app=express();
const {typeDefs}=require("./graphql/schemas");
const {resolvers}=require("./graphql/resolvers");

app.use(cors());


app.use(express.json());

function connectDb(url){
    
    return mongoose.connect(url,{
        useNewUrlParser:true,
        useUnifiedTopology:true    
    });
}

mongoose.Promise=global.Promise;
const start=async()=>{

    
    try{
        
        await connectDb(process.env.MONGO_URI);
        const server=new ApolloServer({typeDefs,resolvers,cors:true});
        await server.start();
        server.applyMiddleware({app,path:"/api/graphql"});


        console.log("connected to db!")
        app.listen(5000,()=>{console.log("Server has started")});
    }catch(e){
        console.log("Error Connecting to db")
        console.log(e);
    }
    
    
}

start();