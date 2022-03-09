const {gql}=require("apollo-server-express")


//root Query and mutation
const typeDefs=gql`

    type Contact{
        email:String
        phone:String
    }
    type Details{
        contact:Contact
        pId:ID!
        photoURL:String
        interests:[String!]!
        displayInfo:String
    }

    type Assets{
        uri:String
        caption:String
    }
    type Club{
        id:ID!
        name:String!
        details:Details!
        projects:[Project]
        people:[postClub]
        wallOfFame:[User]
        picGallery:[Assets]
    }

    type postProject{
        post:String!
        user:User
        project:Project
    }

    
    type postClub{
        post:String!
        user:User
        club:Club
    }

    type Project{
        id:ID!
        title:String!
        details:Details!
        club:Club!
        managers:[User]
        people:[postProject]
        tickets:[Ticket]
        availableTickets:[Ticket]
        isActive:Boolean
        status:StatInfo
    }

    type User{
        name:String!
        id:ID!
        email:String!
        type:String!
        details:Details!
        projects:[postProject]
        clubs:[postClub]
        tickets:[Ticket]
        points:Int!
        recentTicket:Ticket
    }

    type Header{
        project:Project!
        club:Club!
        tags:[String]
    }

    type StatInfo{
        statusNum:Int
        statusLine:String
    }
    type Ticket{
        id:ID!
        name:String!
        type:String!
        assignedBy:User!
        assignedTo:User!
        header:Header!
        available:Boolean!
        shared:[User]
        status:StatInfo
        deadline:String!
        stakeholders:[User]
        isRecent:Boolean!
        displayInfo:String
        requirements:[String]

    }

    

    union SearchResult=User| Club | Project | Ticket

    type Query{
        user(id:ID):User
        userE(email:String):User
        club(id:ID):Club
        project(id:ID):Project
        ticket(id:ID):Ticket
        users:[User!]!
        clubs:[Club!]!
        projects:[Project!]!
        tickets:[Ticket!]!
        search(searchParams:String):[SearchResult]!
    }

    input RegParams{
        name:String
        type:String
        phone:String
        email:String!
        photoURL:String
        interests:[String]
        displayInfo:String

    }

    input PostInput{
        post:String
        user:ID
    }
    input AssetInput{
        caption:String
        uri:String
    }

    input StatusInfo{
        statusNum:Int,
        statusLine:String
    }

    input addToClubType{
        cid:String!
        post:String
    }
    
    input addToProjectType{
        pid:String!
        post:String
    }
    input headerInput{
        cid:ID!
        pid:ID!
    }
    input TicketBasics{
        name:String!
        type:String!
        header:headerInput!
        status:StatusInfo!
        deadline:String!
        available:Boolean=true 
        assignedBy:ID!
        assignedTo:ID!
        shared:[ID]
        stakeholders:[ID]
        isRecent:Boolean=false
        displayInfo:String
        requirements:[String]
    }

    input TicketEdit{
        ticketId:String
        status:StatusInfo
        deadline:String
        shared:[ID]
        available:Boolean
        recent:Boolean
        displayInfo:String
    }

    type Mutation{
        registerUser(params:RegParams):User
        editUser(userId:ID!,params:RegParams,points:Int,status:StatusInfo,addToClub:addToClubType,addToProject:addToProjectType,type:String):User
        registerClub(params:RegParams,picGallery:[AssetInput]):Club
        registerProject(clubId:ID!,params:RegParams!,lead:ID!):Project
        editClub(clubId:ID!,params:RegParams,wallOfFame:[ID],picGallery:[AssetInput]):Club
        editProject(projectId:ID!,params:RegParams,status:StatusInfo,managers:[String],isActive:Boolean):Project
        registerTicket(info:TicketBasics):Ticket
        editTicket(info:TicketEdit):Ticket

    }
`



module.exports={typeDefs};