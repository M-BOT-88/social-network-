const express =require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const auth =require('../../middleware/auth');
const User=require('../../models/thing');
const check=require('express-validator/check').check;
const valdidationResult=require('express-validator/check').check;
const config=require('config');
const jwt=require('jsonwebtoken');
router.get('/',auth,async(req,res)=> {
    try{
        const user =await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
    });
    router.post(
        '/',
        [
            check('name','Name is required').not()
            .isEmpty(),
            
            check('email','please include a valid email').isEmail(),
            check( 
                'password',
                'please is required').exists()
            ],
                
               async (req,res)=>{
                   const errors =valdidationResult(req);
                   if(!errors.isEmpty()){
                       return  res.status(400).json({errors:errors.array()});
                   }
                   const {name,email,password}=req.body;
                   try{
                       let user = await User.findOne({email});
    if(!user){
        res.status(400).json({errors:[{msg:'Invalid credentials'}]});
    }
    const isMatch =await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res 
        .status(400)
        .json({errors:[{msg:'Invalid credentials'}]})
    }
    
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
