const {
TicketType,
ProjectType,
ClubType,
UserType,
postProjectType,
postClubType
}=require("./schema/pSchema");

//dummy data
//const {Details,Users,Tickets,Clubs,Projects,Positions}=require("./DB");

const {UserModel,PositionModel}=require("./dbModels/UserModel")
const TicketModel=require("./dbModels/TicketModel");
const ProjectModel=require("./dbModels/ProjectModel");
const DetailsModel=require("./dbModels/DetailsModel");
const ClubModel=require("./dbModels/ClubModel");

const {GraphQLList,GraphQLObjectType,GraphQLID,
    GraphQLSchema, GraphQLString, GraphQLInt,
GraphQLBoolean, GraphQLNonNull} = require("graphql")


//root Query
const RootQueryType=new GraphQLObjectType({
    name:"rootQuery",
    fields:{
        user:{
            type:UserType,
            args:{id:{type:GraphQLID}},
            resolve:async(parent,args)=>{
                //filter user
                try{
                    const res=await UserModel.findById(args.id)
                    return res;

                }catch(err){
                    return {err};
                }
            }
        },
        project:{
            type:ProjectType,
            args:{id:{type:GraphQLID}},
            resolve:async(parent,args)=>{
                //filter project

                //return Projects.find(ele=>ele.id===args.id);
                try{
                    const res=await ProjectModel.findById(args.id)
                    return res;
                }catch(e){
                    return {e}
                }
            }
        },
        club:{
            type:ClubType,
            args:{id:{type:GraphQLID}},
            resolve:async(parent,args)=>{
                //filter clubtry{
                try{
                    const res=await ClubModel.findById(args.id)
                    return res;
                }catch(e){
                    return {e}
                }
            }
        },
        projects:{
            type:new GraphQLList(ProjectType),
            resolve:async(parent,args)=>{
                //get all
                try{
                    const res=await ProjectModel.find({})
                    return res;
                }catch(e){
                    return {e}
                }

            }
        },
        clubs:{
            type:new GraphQLList(ClubType),
            resolve:async(parent,args)=>{
                try{
                    const res=await ClubModel.find({})
                    return res;
                }catch(e){
                    return {e}
                }
            }
        },
        users:{
            type:new GraphQLList(UserType),
            resolve:async(parent,args)=>{
                try{
                    const res=await UserModel.find({});
                    return res;
                }catch(e){
                    return {e}
                }
            }
        },
        ticket:{
            type: TicketType,
            args:{id:{type:GraphQLID}},
            resolve:async(parent,args)=>{
                let res=await TicketModel.findById(args.id);
                return res;
            }
        },
        tickets:{
            type:new GraphQLList(TicketType),
            resolve:async(parent,args)=>{
                let res=await TicketModel.find({});
                console.log(res);
                return res;
            }
        }
    }
})

const Mutation=new GraphQLObjectType({
    name:"Mutation",
    //mutation Types
    //add User
    fields:{
        addUser:{
            type:UserType,
            args:{
                name:{type:GraphQLString},
                type:{type:GraphQLString},
                contact:{type:GraphQLString},
                photoURL:{type:GraphQLString},
                about:{type: new GraphQLList(GraphQLString)},
                history:{type: new GraphQLList(GraphQLString)}
            },
            resolve:async(parent,args)=>{
                let obj={name:args.name,type:args.type};
                try{
                    
                    const res=await UserModel.create(obj);
                    let res2=await DetailsModel.create({pId:res._id,contact:args.contact,
                    photoURL:args.photoURL,about:args.photoURL,history:args.history})
                    return res;
                }catch(e){
                    return {e}
                }
            }
        },
        editUser:{
            type:UserType,
            args:{
                userId:{type:new GraphQLNonNull(GraphQLID)},
                type:{type:GraphQLString},
                contact:{type:GraphQLString},
                photoURL:{type:GraphQLString},
                about:{type: new GraphQLList(GraphQLString)},
                history:{type: new GraphQLList(GraphQLString)}
            },
            resolve:async(parent,args)=>{
                
                
                let x=await UserModel.findById(args.userId);  
                let xd=await DetailsModel.findOne({pId:x._id});  
                let obj={type:args.type?args.type:x.type};
                let obj2={
                    contact:args.contact?args.contact:xd.contact,
                    photoURL:args.photoURL?args.photoURL:xd.photoURL,
                    about:args.about?args.about:xd.about,
                    history:args.history?args.history:xd.history,    
                }
                    const res=await UserModel.findOneAndUpdate({_id:x._id},obj);
                    let res2=await DetailsModel.findOneAndReplace({pId:x._id},obj2);
                    return res;
                
            }
        },
        //add Club
        addClub:{
            type:ClubType,
            args:{
                name:{type:GraphQLString},
                picGallery:{type:new GraphQLList(GraphQLString)},
                testimonials:{type:new GraphQLList(GraphQLString)},
                news:{type:new GraphQLList(GraphQLString)},
                contact:{type:GraphQLString},
                photoURL:{type:GraphQLString},
                about:{type: new GraphQLList(GraphQLString)},
                history:{type: new GraphQLList(GraphQLString)}
            },
            resolve:async(parent,args)=>{
                let obj={name:args.name,picGallery:args.picGallery,
                testimonials:args.testimonials,news:args.news};
                try{
                    
                    const res=await ClubModel.create(obj);
                    const res2=await DetailsModel.create({pId:res._id,contact:args.contact,
                    photoURL:args.photoURL,about:args.photoURL,history:args.history});

                    return res;
                }catch(e){
                    return {e}
                }
            }
        },
    //add Project
        editClub:{
            type:ClubType,
            args:{
                clubId:{type:new GraphQLNonNull(GraphQLID)},
                picGallery:{type:new GraphQLList(GraphQLString)},
                testimonials:{type:new GraphQLList(GraphQLString)},
                news:{type:new GraphQLList(GraphQLString)},
                contact:{type:GraphQLString},
                photoURL:{type:GraphQLString},
                about:{type: new GraphQLList(GraphQLString)},
                history:{type: new GraphQLList(GraphQLString)}
            },
            resolve:async(parent,args)=>{
              
                  
                let x=await ClubModel.findById(args.clubId);  
                let xd=await DetailsModel.findOne({pId:x._id});  
                let obj={
                    picGallery:args.picGallery?args.picGallery:x.picGallery,
                    testimonials:args.testimonials?args.testimonials:x.testimonials,
                    news:args.news?args.news:x.news,

                };
                let obj2={
                    contact:args.contact?args.contact:xd.contact,
                    photoURL:args.photoURL?args.photoURL:xd.photoURL,
                    about:args.about?args.about:xd.about,
                    history:args.history?args.history:xd.history,    
                }

                try{
                    
                    const res=await ClubModel.findOneAndUpdate({_id:x._id},obj);
                    const res2=await DetailsModel.findOneAndReplace({_id:xd._id},obj2)

                    return res;
                }catch(e){
                    return {e}
                }
            }
        },

        addProjects:{
            type:ProjectType,
            args:{
                title:{type:GraphQLString},
                cid:{type:GraphQLID},
                picGallery:{type:new GraphQLList(GraphQLString)},
                testimonials:{type:new GraphQLList(GraphQLString)},
                news:{type:new GraphQLList(GraphQLString)},
                statusNum:{type:GraphQLInt},
                statusLine:{type:GraphQLString},
                contact:{type:GraphQLString},
                photoURL:{type:GraphQLString},
                about:{type: new GraphQLList(GraphQLString)},
                history:{type: new GraphQLList(GraphQLString)}
            },
            resolve:async(parent,args)=>{
                let obj={title:args.title,cid:args.cid,picGallery:args.picGallery,
                testimonials:args.testimonials,news:args.news,
            statusNum:args.statusNum,statusLine:args.statusLine};
                try{
                    
                    const res=await ProjectModel.create(obj);
                    const res2=await DetailsModel.create({pId:res._id,contact:args.contact,
                        photoURL:args.photoURL,about:args.photoURL,history:args.history});
                    return res;
                }catch(e){
                    console.log(e)
                }
            }
        },

        editProject:{
            type:ProjectType,
            args:{
                projectId:{type:new GraphQLNonNull(GraphQLID)},
                picGallery:{type:new GraphQLList(GraphQLString)},
                testimonials:{type:new GraphQLList(GraphQLString)},
                news:{type:new GraphQLList(GraphQLString)},
                statusNum:{type:GraphQLInt},
                statusLine:{type:GraphQLString},
                contact:{type:GraphQLString},
                photoURL:{type:GraphQLString},
                about:{type: new GraphQLList(GraphQLString)},
                history:{type: new GraphQLList(GraphQLString)}
            },
            resolve:async(parent,args)=>{
                  
                let x=await ProjectModel.findById(args.projectId);  
                let xd=await DetailsModel.findOne({pId:x._id});  
                let obj={
                    picGallery:args.picGallery?args.picGallery:x.picGallery,
                    testimonials:args.testimonials?args.testimonials:x.testimonials,
                    news:args.news?args.news:x.news,
                    statusNum:args.statusNum?args.statusNum:x.statusNum,
                    statusLine:args.statusLine?args.statusLine:x.statusLine
                };
                let obj2={
                    contact:args.contact?args.contact:xd.contact,
                    photoURL:args.photoURL?args.photoURL:xd.photoURL,
                    about:args.about?args.about:xd.about,
                    history:args.history?args.history:xd.history,    
                }

                try{
                    
                    const res=await ProjectModel.findOneAndUpdate({_id:x._id},obj);
                    const res2=await DetailsModel.findOneAndReplace({_id:xd._id},obj2)

                    return res;
                }catch(e){
                    return {e}
                }
            }
        },
        //add new Position to the User
        
        addProjectPost:{
            type:postProjectType,
            args:{
                post:{type:GraphQLString},
                uid:{type:GraphQLID},
                pid:{type:GraphQLID},
            },
            resolve:async(parent,args)=>{
                let x=await PositionModel.findOne({uid:args.uid,pid:args.pid});
                if(x===null){
                    let res=await PositionModel.create({uid:args.uid,pid:args.pid,post:args.post});
                    return res;
                }else{
                    let res=await PositionModel.updateOne({_id:x._id},{post:args.post});
                    return res;
                }
            }
        },
        
         
        addClubPost:{
            type:postClubType,
            args:{
                post:{type:GraphQLString},
                uid:{type:GraphQLID},
                cid:{type:GraphQLID},
            },
            resolve:async(parent,args)=>{
                let x=await PositionModel.findOne({uid:args.uid,cid:args.cid});
                if(x===null){
                    let res=await PositionModel.create({uid:args.uid,cid:args.cid,post:args.post});
                    return res;
                }else{
                    let res=await PositionModel.updateOne({_id:x._id},{post:args.post});
                    return res;
                }
            }
        },
        //create Ticket (Project Manager)
        createTicket:{
            type:TicketType,
            args:{
                name:{type:new GraphQLNonNull(GraphQLString)},
                type:{type:new GraphQLNonNull(GraphQLString)}, 
                pid:{type:new GraphQLNonNull(GraphQLString)},
                cid:{type:new GraphQLNonNull(GraphQLString)}, 
                available:{type:GraphQLBoolean},
                statusNum:{type:GraphQLInt},
                statusLine:{type:GraphQLString},
                deadLine:{type:GraphQLString},
                assignedBy:{type:GraphQLID},
                assignedTo:{type:GraphQLID},
                stakeHolders:{type:new GraphQLList(GraphQLID)},
                relatedItems:{type:new GraphQLList(GraphQLID)},
            },
            resolve:async(parent,args)=>{
               let obj={name:args.name,type:args.type,header:{pid:args.pid,cid:args.cid},
               available:args.available,statusNum:args.statusNum,statusLine:args.statusLine,
               deadLine:args.deadLine,assignedBy:args.assignedBy,
               assignedTo:args.assignedTo,stakeholders:args.stakeHolders,
               relatedItems:args.relatedItems};

               let res=await TicketModel.create(obj);
               return res;
                   
            } 
        },
        //edit ticket(marking)
        editTicket:{
            type:TicketType,
            args:{
                ticketId:{type:new GraphQLNonNull(GraphQLString)},
                name:{type:GraphQLString},
                available:{type:GraphQLBoolean},
                statusNum:{type:GraphQLInt},
                statusLine:{type:GraphQLString},
                deadLine:{type:GraphQLString},
                assignedBy:{type:GraphQLID},
                assignedTo:{type:GraphQLID},
                stakeHolders:{type:new GraphQLList(GraphQLID)},
                relatedItems:{type:new GraphQLList(GraphQLID)},
            },
            resolve:async(parent,args)=>{

                let x=await TicketModel.findById(args.ticketId);
              
               let obj={name:(args.name)?args.name:x.name,
               available:args.available?args.available:x.available,
               statusNum:args.statusNum?args.statusNum:x.statusNum,
               statusLine:args.statusLine?args.statusLine:x.statusLine,
               deadLine:args.deadLine?args.deadLine:x.deadLine,
               assignedBy:args.assignedBy?args.assignedBy:x.assignedBy,
               assignedTo:args.assignedTo?args.assignedTo:x.assignedTo,
               relatedItems:args.relatedItems?args.relatedItems:x.relatedItems,
               stakeHolders:args.stakeHolders?args.stakeHolders:x.stakeHolders
            };

               x=await TicketModel.findOneAndUpdate({_id:x._id},obj);
               let res=await TicketModel.findById(x._id);
               return res;
              
            } 
        }
    }


})


module.exports=new GraphQLSchema({
    query:RootQueryType,
    mutation:Mutation
});