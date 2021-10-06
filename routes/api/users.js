const express=require('express');
const router =express.Router();
const check=require('express-validator/check').check;
const valdidationResult=require('express-validator/check').check;
const bcrypt=require('bcryptjs');
const User =require('../../models/thing');
const jwt=require('jsonwebtoken');
const config=require('config');
//const { valdidationResult } = require('express-validator');
router.post(
    '/',
    [
        check('name','Name is required').not()
        .isEmpty(),
        
        check('email','please include a valid email').isEmail(),
        check( 
            'password',
            'please enter a password with 6 or more characters').isLength({min:6})
        ],
            
           async (req,res)=>{
               const errors =valdidationResult(req);
               if(!errors.isEmpty()){
                   return  res.status(400).json({errors:errors.array()});
               }
               const {name,email,password}=req.body;
               try{
                   let user = await User.findOne({email});
if(user){
    res.status(400).json({errors:[{msg:"user already exists"}]});
}
user=new User({
    name,
    email,
    password
});
const salt =await bcrypt.genSalt(10);
user.password=await bcrypt.hash(password,salt);
await user.save();
const payload = {
    user:{
        id:user.id
    }
};
jwt.sign(payload,config.get('jwtSecret') ,{expiresIn:360000},(err,token)=>{
    if(err) throw err;
    res.json({token});
}
);
         //  res.send('user registered');
            }catch(err){
                console.error(err.message);
                res.status(500).send('server error');
            }
        
        }
);

module.exports=router;