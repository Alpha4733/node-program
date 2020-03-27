const mongoose= require('mongoose');
const bcrypt= require('bcryptjs');
const jwt= require('jsonwebtoken');
 const listSchema=mongoose.Schema({

    user:{
        type:String,
        require:true,
        unique:true,
        default:'MRX'
        },

        pass:{
            type:String,
            require:true,
            default:'alpha'
        },

        completed:{
            type:Boolean,
            default:true
        },

        avatar:{ 
            type:Buffer
        },

        tokens:[{
            tokens:{
                type:String,
                require:true
            }
        }],

},{
timestamps:true
})




listSchema.methods.generateAuthToken=   async function(){

    const user = this;
    const token  =jwt.sign({_id:user._id.toString()},'iamgrowing');
  //  user.tokens= user.tokens.concat({token});
    await user.save();
    return (token);

    }

listSchema.statics.findByCredentials = async function (username,password){

    const sch=this;
   var userData = await sch.findOne({"user":username});


        if(!userData){
            throw new Error("No Such Data Present"); 
        }
          
            
        const isMatch= bcrypt.compare(password,userData.pass);

        if(!isMatch){
            throw new Error('unable to login')
        }
        
        else{
            
            return (userData);
        }

    }
       
      
        //const tkn= obj.generateAuthToken();
        
       
       
        
    



listSchema.pre('save', async function (next){

    const user= this;

    if(user.isModified('pass')){

        user.pass= await bcrypt.hash(user.pass,8)
    }

    next(); 
})

const list= mongoose.model('list',listSchema);

module.exports=list;