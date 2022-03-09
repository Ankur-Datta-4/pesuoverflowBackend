const {UserModel,PositionModel}=require("../dbModels/UserModel")
const TicketModel=require("../dbModels/TicketModel");
const ProjectModel=require("../dbModels/ProjectModel");
const DetailsModel=require("../dbModels/DetailsModel");
const ClubModel=require("../dbModels/ClubModel");

const {FuzzySearch} =require("mongoose-fuzzy-search-next")
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const resolvers={
    Query:{
        user:async(parent,args)=>{
            let res=await UserModel.findById(args.id);
            return res
        },
        userE:async(parent,args)=>{
            let res=await UserModel.findOne({email:args.email});
            return res;
        },
        
        club:async(parent,args)=>{
            let res=await ClubModel.findById(args.id);
            return res;
        },
        project:async(parent,args)=>{
            let res=await ProjectModel.findById(args.id);
            return res;
        },
        ticket:async(parent,args)=>{
            let res=await TicketModel.findById(args.id);
            return res;
        },
        users:async()=>{
            let res=await UserModel.find({})
            return res;
        },
        
        clubs:async()=>{
            let res=await ClubModel.find({})
            return res;
        },
        
        projects:async()=>{
            let res=await ProjectModel.find({})
            return res;
        },
        
        tickets:async()=>{
            let res=await TicketModel.find({})
            return res;
        },
        search:async(parent,{searchParams})=>{
            const regex=new RegExp(escapeRegex(searchParams),'gi')
           
           let dets=await DetailsModel.find({$or:[{displayInfo:regex},{interests:regex}]});
           
            //let tickets=await TicketModel.
            //const dets=await DetailsModel.find(FuzzySearch(["contact.email"],searchParams));
            
            let pIds=dets.map((item)=>item.pId);
            let users=await UserModel.find({$or:[FuzzySearch(['name'],searchParams),{_id:{$in:pIds}}]});
            let clubs=await ClubModel.find({$or:[FuzzySearch(['name'],searchParams),{_id:{$in:pIds}}]});
            let projects=await ProjectModel.find({$or:[FuzzySearch(['title'],searchParams),{_id:{$in:pIds}}]});
            let tickets=await TicketModel.find({$or:[{displayInfo:regex},{name:regex},{requirements:regex}]});
            
            return [...users,...clubs,...projects, ...tickets];
        }


    },
    SearchResult:{
        __resolveType(obj){
            if(obj.points>=0)
                return "User"
            if(obj.title)
                return "Project"
            if(obj.wallOfFame)
                return "Club"
            if(obj.header)
                return "Ticket"
            return null;
        }
    },
    postProject:{
        user:async(parent)=>{
            let res=await UserModel.findById(parent.uid);
            return res;
        },
        project:async(parent)=>{
            let res=await ProjectModel.findById(parent.pid);
            return res;
        }
    },
    postClub:{
        user:async(parent)=>{
            let res=await UserModel.findById(parent.uid);
            return res;
        },
        club:async(parent)=>{
            let res=await ClubModel.findById(parent.cid);
            return res;
        }
    },
    Club:{
        details:async(parent)=>{
            const res=await DetailsModel.findOne({pId:parent._id});
            return res;
        },
        projects:async(parent)=>{
            const res=await ProjectModel.find({cid:parent._id});
            return res;
        },
        people:async(parent)=>{
            let res=await PositionModel.find({cid:parent._id});
            return res;
        },
        wallOfFame:async(parent)=>{
            let res=await UserModel.find({_id:{$in:parent.wallOfFame}});
            return res;
        }
    },

    Project:{
        details:async(parent)=>{
            const res=await DetailsModel.findOne({pId:parent._id})
            return res;
        },
        club:async(parent)=>{
            const res=await ClubModel.findById(parent.cid);
            return res;
        },
        managers:async(parent)=>{
            let res=await UserModel.find({_id:{$in:parent.managers}});
            return res;
        },
        people:async(parent)=>{
            let res=await PositionModel.find({pid:parent._id});
            return res;
        },
        tickets:async(parent)=>{
            let res=await TicketModel.find({"header.pid":parent._id});
            return res;
        },
        availableTickets:async(parent)=>{
            let res=await TicketModel.find({"header.pid":parent._id,available:true});
            return res;
        }
    },

    User:{
        details:async(parent)=>{
            let res=await DetailsModel.findOne({pId:parent._id});
            return res;
        },
        projects:async(parent)=>{
            let res = await PositionModel.find({uid:parent._id,pid:{$exists:true}});
            return res;
        },
        clubs:async(parent)=>{
            let res = await PositionModel.find({uid:parent._id,cid:{$exists:true}});
            return res;
        },
        tickets:async(parent)=>{
            let res=await TicketModel.find({assignedTo:parent._id});
            return res;
        },
        recentTicket:async(parent)=>{
            let res=await TicketModel.findOne({assignedTo:parent._id,isRecent:true});
            return res;
        }
    },
    Header:{

    },
    Ticket:{
        assignedTo:async(parent)=>{
            let user=await UserModel.findById(parent.assignedTo);
            return user
        },
        assignedBy:async(parent)=>{
            let user=await UserModel.findById(parent.assignedBy);
            return user
        },
        header:async(parent)=>{
            let project=await ProjectModel.findById(parent.header.pid);
            let club=await ClubModel.findById(parent.header.cid);
            return {project,club};
        },
        shared:async(parent)=>{
            let users=await UserModel.find({_id:{$in:parent.shared}});
            return users
        },
        stakeholders:async(parent)=>{
            let users=await UserModel.find({_id:{$in:parent.stakeholders}});
            return users
        }

    },

    Mutation:{
        registerUser:async(parent,{params})=>{
            let {name,type,phone,email,photoURL,interests,displayInfo}=params;
            let contact={phone,email}
            let user=await UserModel.create({name,type,points:0,email});
            let details=await DetailsModel.create({pId:user._id,displayInfo,contact,photoURL,interests})
            return user
        },
        editUser:async(parent,{userId,params,points,status,addToClub,addToProject,type})=>{
            let user=await UserModel.findById(userId);
            if(points){
                let totalPoints=points+user.points;
                user=await UserModel.findOneAndUpdate({_id:userId},{points:totalPoints});
            }
            if(type){
                user=await UserModel.findOneAndUpdate({_id:userId},{type:type});

            }
            if(params){
                const {phone,email,photoURL,interests,displayInfo}=params;
                let pre=await DetailsModel.findOne({pId:userId})
                
                let contact={
                    phone:phone?phone:pre.contact.phone,
                    email:email?email:pre.contact.email
                }
                
                const obj={
                    
                    contact,
                    pId:userId,
                    photoURL:photoURL?photoURL:pre.photoURL,
                    interests:interests?interests:pre.interests,
                    displayInfo:displayInfo?displayInfo:pre.displayInfo
                }
                
    
                let details=await DetailsModel.findOneAndReplace({_id:pre._id},obj);

            }
          

            if(addToClub){
                let position=await PositionModel.findOne({uid:userId,cid:addToClub.cid});
                if(position==null){
                    position=await PositionModel.create({uid:userId,cid:addToClub.cid,post:addToClub.post})
                }else{
                    position=await PositionModel.findOneAndUpdate({_id:position._id},{post:addToClub.post})
                }
            }
           
            
            if(addToProject){
                let position=await PositionModel.findOne({uid:userId,pid:addToProject.pid});
                if(position==null){
                    position=await PositionModel.create({uid:userId,pid:addToProject.pid,post:addToProject.post})
                }else{
                    position=await PositionModel.findOneAndUpdate({_id:position._id},{post:addToProject.post})

                }
            }
            
            return user;
        },
        //interests for club: Niche AREA
        registerClub:async(parent,{params,picGallery})=>{
            const {name,phone,email,photoURL, interests,displayInfo}=params;
            let contact={phone,email}
            let club=await ClubModel.create({name,picGallery});
            let details=await DetailsModel.create({pId:club._id,contact,displayInfo,photoURL,interests})
            return club;
        },
        registerProject:async(parent,{clubId,params,lead})=>{
            const {name,phone,email,photoURL, interests,displayInfo}=params;
            let contact={phone,email}
            let proj=await ProjectModel.create({title:name,cid:clubId,
                managers:[lead],isActive:true});
            let details=await DetailsModel.create({pId:proj._id,contact,photoURL,displayInfo,interests});
            return proj
        },
        editClub:async(parent,{clubId,params,wallOfFame,picGallery})=>{
            const {phone,email,photoURL,interests,displayInfo}=params;
            let club=await ClubModel.findById(clubId);

            if(wallOfFame || picGallery){
                let obj={
                    wallOfFame:wallOfFame?wallOfFame:club.wallOfFame,
                    picGallery:picGallery?picGallery:club.picGallery

                }

                club=await ClubModel.findOneAndUpdate({_id:pre._id},{...obj})
                
            }

            let pre=await DetailsModel.findOne({pId:club._id});
            let contact={
                phone:phone?phone:pre.contact.phone,
                email:email?email:pre.contact.email
            }
            
            const obj={
                
                contact,
                pId:clubId,
                photoURL:photoURL?photoURL:pre.photoURL,
                interests:interests?interests:pre.interests,
                displayInfo:displayInfo?displayInfo:pre.displayInfo
            }
            
            let details=await DetailsModel.findOneAndReplace({_id:pre._id},obj);
            return club;
        },
        editProject:async(parent,{projectId,params,status,managers,isActive})=>{
            const {phone,email,photoURL,interests,displayInfo}=params;
            let proj=await ProjectModel.findById({_id:projectId});
            if(status || managers || isActive) {
            
                let res_managers=pre.managers.concat(managers);
                let obj={
                    status:status?status:pre.status,
                    managers:managers?res_managers:pre.managers,
                    isActive:isActive?isActive:pre.isActive
                }

                proj=await ProjectModel.findOneAndUpdate({_id:projectId},{...obj});
            }

            
            let pre=await DetailsModel.findOne({pId:proj._id});
            let contact={
                phone:phone?phone:pre.contact.phone,
                email:email?email:pre.contact.email
            }
            const obj={
                
                contact,
                pId:clubId,
                photoURL:photoURL?photoURL:pre.photoURL,
                interests:interests?interests:pre.interests,
                displayInfo:displayInfo?displayInfo:pre.displayInfo
            }
            
            let details=await DetailsModel.findOneAndReplace({_id:pre._id},obj);
            return proj;

        },
        registerTicket:async(parent,{info})=>{
            let res=await TicketModel.create(info);
            return res;
        },
        editTicket:async(parent,{ticketId,status,deadline,shared,available,recent,displayInfo})=>{
            let pre=await TicketModel.findById(ticketId);
            let stat=pre.status;
            if(status){
                stat=status;
            }
            let res_shared;
            if(shared)
                res_shared=shared.concat(pre.shared);

            let obj={
                deadline:deadline?deadline:pre.deadline,
                shared:shared?res_shared:pre.shared,
                available:available?available:pre.available,
                recent:recent?recent:pre.recent,
                displayInfo:displayInfo?displayInfo:pre.displayInfo
            }
        }
    }

}



module.exports={resolvers};