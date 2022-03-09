//sample-database
const Users=[
    {
    name:"AA",id:"u1",type:"mentor",
  
    },
    {
        name:"BB",id:"u2",type:"student",
       
    },
    {
        name:"CC",id:"u3",type:"student",
        

    }
]
const Positions=[
    {
        uid:"u1",
        post:"coordinator",
        pid:"p1",
        cid:false
    },
    {
        uid:"u2",
        post:"maintainer",
        pid:"p2",
        cid:false
    },
    {
        uid:"u3",
        post:"stakeholder",
        pid:"p3",
        cid:false
    },
    {
        uid:"u3",
        post:"coordinator",
        pid:false,
        cid:"c1"
    }    
]
const Details=[
    {
        pId:"u1",
        contact:"u1@mail.com",
        photoURL:"noine",
        about:["A","B","C"],
        history:["hA","hB","hC"],
        
    },
    {
        pId:"u2",
        contact:"u2@mail.com",
        photoURL:"noixasasne",
        about:["B","C","D"],
        history:["hA","hB","hC"],
        
    },
    {
        pId:"u3",
        contact:"u3@mail.com",
        photoURL:"nsacasoine",
        about:["A","X","C"],
        history:["hX","hB","hC"],
        
    },
    {
        pId:"p1",
        contact:"p1@mail.com",
        photoURL:"nsacasoine",
        about:["A","X","C"],
        history:["hX","hB","hC"],
        
    }    
    ,

    {
        pId:"c1",
        contact:"c@mail.com",
        photoURL:"acsascs",
        about:["A","X","C"],
        history:["hX","hB","hC"],
        
    }
]

const Projects=[
    {
        title:"p1",
        id:"p1",
        cid:"c1",
        
        
            picGallery:["AAA","BBB","CCC"],
            testimonials:["DDDD","EEEE","FFF"],
            news:["SSSS","RRRRR","TTTT"]
        ,
        statusNum:0.45,        
    },
    {
        title:"p2",
        id:"p2",
        cid:"c1",

            picGallery:["AAA","BBB","CCC"],
            testimonials:["DDDD","EEEE","FFF"],
            news:["SSSS","RRRRR","TTTT"],
        
        statusNum:0.99,        
    },   
     {
        title:"p3",
        id:"p3",
        cid:"c1",

            picGallery:["A","B","C"],
            testimonials:["D","E","F"],
            news:["S","R","T"]
        ,
        statusNum:0.100,        
    },    
]

const Clubs=[
    {
        name:"cs",
        id:"c1",

    }
]

const Tickets=[
    {
        name:"TT",
        id:"T1",
        type:"SSS",
        header:{
            cid:"c1",
            pid:"p1"
        },
        available:false,
        status:"No",
        statusLine:"yes",
        deadLine:"tmrw",
        assignedBy:"u1",
        assignedTo:"u2",
        stakeHolders:["u3","u2"],
        relatedItems:["T2","T3"]
    },
    {
        name:"TT2",
        id:"T2",
        type:"maintainence",
        header:{
            cid:"c2",
            pid:"p2"
        },
        available:false,
        status:"No",
        statusLine:"yes",
        deadLine:"dtmrw",
        assignedBy:"u2",
        assignedTo:"u3",
        stakeHolders:["u1","u3"],
        relatedItems:["T1","T3"]
    },
    {
        name:"TT3",
        id:"T3",
        type:"bug",
        header:{
            cid:"c1",
            pid:"p1"
        },
        available:false,
        status:"No",
        statusLine:"yes",
        deadLine:"never",
        assignedBy:"u3",
        assignedTo:"u1",
        stakeHolders:["u1","u2"],
        relatedItems:["T1","T2"]
    }
]


module.exports={
    Details,
    Users,
    Projects,
    Clubs,
    Tickets,
    Positions
}