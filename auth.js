const jwt = require('jsonwebtoken');
const schema= require('./schema.js');

const auth= async (req,res,next)=>{

    try {
        const token = req.header('Auth').replace('Bearer ','');
        const decoded = jwt.verify(token,'iamgrowing');
        const user= await schema.findOne({_id:decoded._id});
        if(!user){
            throw new Error();
            
        }
        req.user=user;
        next();


    } catch (error) {

        res.status(401).send({error: 'Please Authenticate'});
    }
}


module.exports= auth