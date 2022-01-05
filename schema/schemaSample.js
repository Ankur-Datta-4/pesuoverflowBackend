const {GraphQLObjectType,GraphQLString,GraphQLSchema,
GraphQLID,
GraphQLInt,
GraphQLList}=require("graphql");

const Books=[
    {id:"1",title:"AAA",genre:"XX",authorId:"4"},
    {id:"2",title:"BBB",genre:"YY",authorId:"5"},
    {id:"3",title:"CCC",genre:"ZZ",authorId:"6"},
    {id:"4",title:"DDD",genre:"XX",authorId:"4"},
    {id:"5",title:"EEE",genre:"YY",authorId:"5"},
    {id:"6",title:"FFF",genre:"ZZ",authorId:"6"},
]

const Authors=[
    {id:4,name:"PPP",age:102},
    {id:5,name:"QQQ",age:39},
    {id:6,name:"RRR",age:29},
]

const BookType=new GraphQLObjectType({
    name:"Book",
    fields:()=>({

        title:{type:GraphQLString},
        id:{type:GraphQLID},
        genre:{type:GraphQLString},
        author:{
            type:AuthorType,
            resolve:(parent,args)=>{
                return Authors.find(ele=>ele.id===parent.authorId);
            }
        }
    })
})


const AuthorType=new GraphQLObjectType({
    name:"Author",
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        age:{type:GraphQLInt},
        books:{
            type:new GraphQLList(BookType),
            resolve:(parent,args)=>{
                return Books.filter((ele)=>ele.authorId===parent.id);
            }
        }
    })
    
})

const RootQuery=new GraphQLObjectType({
    name:"RootQueryType",
    fields:{
        book:{
            type:BookType,
            args:{id:{type:GraphQLString}},
            resolve:(parent,args)=>{
               
                return Books.find((ele)=>ele.id===args.id)
            }

        },
        author:{
            type:AuthorType,
            args:{id:{type:GraphQLString}},
            resolve:(parent, args)=>{
                return Authors.find((ele)=>ele.id===args.id)
            }
        },
        books:{
            type:new GraphQLList(BookType),
            resolve:(parent,args)=>{
                return Books;
            }
        },
        authors:{
            type:new GraphQLList(AuthorType),
            resolve:(parent,args)=>{
                return Authors;
            }
        }

    }

})


const RootMutation=new GraphQLObjectType({
    name:"Mutation",
    fields:{
        addAuthor:{
            type:AuthorType,
            args:{
                name:{type:GraphQLString},
                age:{type:GraphQLInt}
            },
            resolve:(parent,args)=>{
                const obj={age:args.age,name:args.name,id:Authors.length+4}
                Authors.push(obj);
                return obj;
            }
        }
    }
})

module.exports=new GraphQLSchema({
    query:RootQuery,
    mutation:RootMutation
});