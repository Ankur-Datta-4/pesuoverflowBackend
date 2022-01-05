const {
GraphQLObjectType,
GraphQLString,
GraphQLList,
GraphQLID,
GraphQLBoolean,
GraphQLFloat
}=require("graphql");

//connection to database
//const {Details,Users,Tickets,Clubs,Projects,Positions}=require("../DB");

const {UserModel,PositionModel}=require("../dbModels/UserModel");
const DetailsModel=require("../dbModels/DetailsModel");
const ProjectModel=require("../dbModels/ProjectModel");
const ClubModel=require("../dbModels/ClubModel");
const TicketModel=require("../dbModels/TicketModel");

//details
const DetailsType=new GraphQLObjectType({
    name:"details",
    fields:()=>({
        contact:{type:GraphQLString},
        pId:{type:GraphQLID},
        photoURL:{type:GraphQLString},
        about:{
            type:new GraphQLList(GraphQLString)
        },
        history:{
            type:new GraphQLList(GraphQLString)
        }
    })
})




const HeaderType=new GraphQLObjectType({
    name:"header",
    fields:()=>({
        club:{type:ClubType},
        project:{type:ProjectType}
    })
})

//tickets
const TicketType=new GraphQLObjectType({
    name:"ticket",
    fields:()=>({
        name:{type:GraphQLString},
        id:{type:GraphQLID},
        type:{type:GraphQLString},  
        header:{type:HeaderType,
        resolve:async(parent,args)=>{
            const club=await ClubModel.findById(parent.header.cid);
            const project=await ProjectModel.findById(parent.header.pid);
            return {club,project}
        }},
        available:{type:GraphQLBoolean},
        statusNum:{type:GraphQLString},
        statusLine:{type:GraphQLString},
        deadline:{type:GraphQLString},
        assignedBy:{type:UserType,
        resolve:async(parent,args)=>{
            const res=await UserModel.findById(parent.assignedBy)
            return res;
        }},
        assignedTo:{type:UserType,
        resolve:async(parent,args)=>{
            const res=await UserModel.findById(parent.assignedTo)
            return res;
        }},
        //stakeholders
        stakeHolders:{type:new GraphQLList(UserType)},
        relatedItems:{type:new GraphQLList(TicketType)}
        
    })
})
//User

const UserType=new GraphQLObjectType({
    name:"User",
    fields:()=>({
        name:{type:GraphQLString},
        id:{type:GraphQLID},
        type:{type:GraphQLString},
        details:{
            type:DetailsType,
            resolve:async(parent,args)=>{
                //if parent.id===details.pId
                const res=await DetailsModel.findOne({pId:parent._id});
                return res;
               
            }
        },
        projects:{type:new GraphQLList(postProjectType),
        resolve:async(parent,args)=>{
            const res=await PositionModel.find({uid:parent._id,cid:undefined});
            return res;
        }},
        
        clubs:{type:new GraphQLList(postClubType),
        resolve:async(parent,args)=>{
            //return Positions.filter(ele=>ele.uid===parent.id && !ele.pid);
            const res=await PositionModel.find({uid:parent._id,pid:undefined});
            return res;
        }},
        tickets:{type:new GraphQLList(TicketType),
        resolve:async(parent,args)=>{
            //filter wrt assignedTo
            //return Tickets.filter(ele=>ele.assignedTo===parent.id)
            const res=await TicketModel.find({assignedTo:parent._id});
            return res;

        }}
        
    })
})
//Projects

const postProjectType=new GraphQLObjectType({
    name:"postP",
    fields:()=>({
        post:{type:GraphQLString},
        project:{type:ProjectType,
        resolve:async(parent,args)=>{
            //return Projects.find(ele=>ele.id===parent.pid);
            const res=await ProjectModel.findById(parent.pid);
            return res;
        }}
    })
})


const ProjectType=new GraphQLObjectType({
    name:"Project",
    fields:()=>({
        title:{type:GraphQLString},
        id:{type:GraphQLID},
        club:{type:ClubType,
        resolve:async(parent,args)=>{
            //return Clubs.find(ele=>ele.id===parent.cid)
             const res=ClubModel.findById(parent.cid);
             return res;   
        }},
        //object: caption, pic
        picGallery: {type:new GraphQLList(GraphQLString)},
        
        testimonials: {type:new GraphQLList(GraphQLString)}, 
        news: {type:new GraphQLList(GraphQLString)},
        details:{
            type:DetailsType,
            resolve:async(parent,args)=>{
                const res=await DetailsModel.find({pId:parent._id});
                return res;
            }
        },
        statusNum:{type:GraphQLFloat},
        tickets:{type:new GraphQLList(TicketType),
            resolve:async(parent,args)=>{
                //ticket.projectid===parent.id
                const res=await TicketModel.find({'header.pid':parent._id});
                return res;
            }},
        coordinators:{type:new GraphQLList(UserType),
        resolve:async(parent,args)=>{
             //filter users
            let cord=await PositionModel.find({post:"coordinator",cid:undefined});
            let usrs=cord.map(ele=>ele.uid);
            let res=await UserModel.find({_id:{$in:usrs}})
             
            return res;

            }},
        stakeholders:{type:new GraphQLList(UserType),
        resolve:async(parent,args)=>{
              //filter users
              let cord=await PositionModel.find({post:"stakeholder",cid:undefined});
              let usrs=cord.map(ele=>ele.uid);
              let res=await UserModel.find({_id:{$in:usrs}})
              return res;
 
        }},
        availableTickets:{
            type:new GraphQLList(TicketType),
            resolve:async(parent,args)=>{
                const res=await TicketModel.find({'header.pid':parent._id,available:true})
                return res;
        }},
        maintainers:{type:new GraphQLList(UserType),
        resolve:async(parent,args)=>{
            let cord=await PositionModel.find({post:"maintainer",cid:undefined});
            let usrs=cord.map(ele=>ele.uid);
            let res=await UserModel.find({_id:{$in:usrs}})
             
            return res;
        }},
      //conversations  
    })

    
})



const postClubType=new GraphQLObjectType({
    name:"postC",
    fields:()=>({
        post:{type:GraphQLString},
        club:{type:ClubType,
        resolve:async(parent,args)=>{
            const res=ClubModel.findById(parent.cid);
            return res;
        }}
    })
})

//Clubs
const ClubType=new GraphQLObjectType({
    name:"club",
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        details:{type:DetailsType,
        resolve:async(parent,args)=>{
            const res=await DetailsModel.find({pId:parent._id});
            return res;


        }},
        coordinators:{type:new GraphQLList(UserType),
            resolve:async(parent,args)=>{
                let cord=await PositionModel.find({post:"coordinator",pid:undefined});
                let usrs=cord.map(ele=>ele.uid);
                let res=await UserModel.find({_id:{$in:usrs}})
                 
                return res;

            }
        },
        members:{type:new GraphQLList(UserType),
        resolve:async(parent,args)=>{
            let cord=await PositionModel.find({post:"member",pid:undefined});
            let usrs=cord.map(ele=>ele.uid);
            let res=await UserModel.find({_id:{$in:usrs}})
             
            return res;
        }},
        projects:{type:new GraphQLList(ProjectType),
        resolve:async(parent, args)=>{
            //project.clubId===parent.id
            const res=await ProjectModel.find({cid:parent._id});
            return res;
        }}
    })
})

module.exports={
    TicketType,
    UserType,
    ProjectType,
    ClubType,
    postClubType,
    postProjectType
}