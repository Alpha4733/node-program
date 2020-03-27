const express= require('express');
const bcrypt= require('bcryptjs');
 const list =require('./schema.js');
var mongo = require('./mongo.js');
var bodyParser= require('body-parser');
const mongoose= require("mongoose");
const jwt= require('jsonwebtoken')
const multer = require('multer');
const auth= require('auth')





var app = express();
app.use(bodyParser.json());
app.use(express.json())


///////////////////////////////////////////////////////






////////////////////////////////////////////////////////
// app.get('/check/:user',(req,res)=>{

//     var xx = list.findOne({user:req.body.user})
//     res.send(xx);

// })

// uploading image


const upload=multer({
   // dest: 'images',
    limits:{
        fileSize:1000000
    },

    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(doc|jpeg|jpg|png)$/)){
            return cb (new  Error('File type not supported'));
        }

        cb(undefined,true);
    }

});

app.post('/upload', upload.single('upload') , (req,res)=>{
    
    try {
        res.send('Photo uploaded successfully');
        
    } catch (error) {
        res.send('Error in uploading ');
        
    } 
});


//Insertig data
app.post('/insert',(req,res)=>
{
    const List= new list(req.body);

    List.save().then(()=>{
        const tk =List.generateAuthToken();
        res.status(201).send({List,tk})
    }).catch((err)=>{
        res.status(404);
    })

})

//searching





//login
app.post('/login',async (req,res)=>{
try {
    
        var dta = await list.findByCredentials(req.body.user,req.body.pass);
  var token= await dta.generateAuthToken();
  
  await dta.save();
        
        if(!dta){
            console.log("No data");
        }
        console.log(dta);
        res.send({dta,token});
    
    }
    catch(e){
        res.status(400).send();
    } 
})



//Finding all data

app.get('/list',auth,(req,res)=>{

    list.find({}).then((data)=>{
        res.send(data);
    }).catch((e)=>{
        res.status(404).send()
    })
}); 

//Updating Data

app.patch('/update/:id',async (req,res)=>{


    var updates= Object.keys(req.body);

    try {
            var newdata= await list.findById(req.params.id)
            updates.forEach((update)=>{ newdata[update]=req.body[update]})

            await newdata.save();

            res.send(newdata);

            

            // var udata= await list.findByIdAndUpdate
            // (req.params.id,req.body,{new:true,runValidators:true});

            // if(!udata)
            // {
            //     return res.status(404).send();
            // }
            // res.send(udata);

        } catch (e) {
            res.status(404).send(e);
            }       
    });

//Deletion

app.delete('/delete/:id',async (req,res)=>{

    try {
        var ddata= await list.findByIdAndRemove(req.body.id).then((doc)=>{
            res.send(doc);
        })
           
        }catch(error) {
        res.status(500).send(error);
    }
 
});

//adding profile pic

// app.post('/avatar',upload.single('avatar'), async (req,res)=>{
//     req.list.avatar= req.file.buffer; 
//     await req.list.save();
//     res.send('profile saved');

// },(error,req,res)=>{
//     res.status(400).send({error:error.message})
// });


///////////////////////////////////////////



app.listen(3000,()=>{
    console.log('SERVER STARTED')
});