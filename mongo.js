const mongoose= require('mongoose');

mongoose.Promise=global.Promise;
require('dotenv').config();

mongoose.connect(process.env.dbURL,{useNewUrlParser:true,useCreateIndex:true}, (err)=>{
    if(err)
        {console.log("UNABLE TO CONNECT\n")}
        else{console.log("DATABASE CONNECTED\n")}
})

module.exports=mongoose;


