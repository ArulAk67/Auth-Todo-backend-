import mongoose from "mongoose";
import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otpGenerator from 'otp-generator';

export async function verifyUser(req, res, next){
    try {
        
        const { username } = req.body;

        // check the user existance
        let exist = await User.findOne({ username });
        if(!exist) return res.status(404).send({ error : "Can't find User!"});
        // next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error"});
    }
    return res.status(200).json({ message:"valid user"}); 

};

export async function register(req,res){
    const { username, password, profile, email } = req.body;   
    if(!username && username.trim()==="" && !email && email.trim()==="" && !password && password.trim()==="")
    {
        return res.status(422).json({message:"invalid inputs"})
    }
    const hashpassword=bcrypt.hashSync(password);
    let user;
    try {
        user = new User({username,email,profile: profile || '',password:hashpassword});
        user=  await user.save();
    } catch (err) {
        return console.log(err);
    }
    if (!user) {
        return res.status(500).json({ message: "Unexpected Error Occured" });
    }
    return res.status(200).json({user,status:200});    

        
}

export const login = async(req,res,next)=>{
    const {username,password} =req.body;
  
      if( !username && username.trim()==="" && !password && password.trim()==="")
      {
          return res.status(422).json({message:"invalid inputs"})
      }
      let existingUser;
      try{
          existingUser=await User.findOne({username});
      }catch(err)
      {
        return console.log(err);
      }
  
      if(!existingUser)
      {
        return res.status(404).json({ message: "Unable to find user" });
      }
  
      const ispassword=bcrypt.compareSync(password,existingUser.password);
  
      if(!ispassword){
        return res.status(500).json({ message: "Icorrect password" });
      }

      const token=jwt.sign({id:existingUser._id},process.env.SECRET_KEY,{expiresIn:"7d"});
  
      return res.status(200).json({ message:"login sucessfully", token,id:existingUser._id});
  
  };
  export const updateuser = async(req,res,next)=>{
    const extractedToken=req.headers.authorization.split(" ")[1]; 

   if(!extractedToken && extractedToken.trim()==="")
   {
     return res.status(404).json({message:"Token not found"});
   }
   
   let userId;
   

   jwt.verify(extractedToken,process.env.SECRET_KEY,(err,decrypted)=>{
     if(err){
        return res.status(400).json({message:`${err.message}`});
     }else{
        userId=decrypted.id;
        return;
     }
   });
   
   let user;
   const body = req.body;
//    console.log(req.body);
   try{
    const id=new mongoose.Types.ObjectId(userId)
    user = await User.findByIdAndUpdate(id,body);
    } 
    catch(err){
        return console.log(err);
    }

    if (!user) {
        return res.status(500).json({ message: "Unexpected Error Occured" });
    }
    return res.status(200).json({ message:"Updated sucessfully" });
  }

  export const getUser = async (req, res, next) => {
    const {username} = req.params;
    console.log(req.params);
    let user;
    try {
      user = await User.findOne({ username });
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

export async function generateOTP(req,res){
  
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
    res.status(201).send({ code: req.app.locals.OTP })
}

export async function verifyOTP(req,res){
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).send({ msg: 'Verify Successsfully!'})
    }
    return res.status(400).send({ error: "Invalid OTP"});
}

export async function createResetSession(req,res){
    if(req.app.locals.resetSession){
         return res.status(201).send({ flag : req.app.locals.resetSession})
    }
    return res.status(440).send({error : "Session expired!"})
 }

export async function resetPassword(req,res){

    try {
        
         if(!req.app.locals.resetSession) return res.status(440).send({error : "Session expired!"});

        const { username, password } = req.body;
        const hashpassword=bcrypt.hashSync(password);
        let user;
        try{
            
            user = await User.findOneAndUpdate({username},{password:hashpassword});
            } 
            catch(err){
                return console.log(err);
            }
        
            if (!user) {
                return res.status(500).json({ message: "Unexpected Error Occured" });
            }
            
            req.app.locals.resetSession = false;
            return res.status(200).json({ message:"Updated sucessfully" });

        
    } catch (error) {
        return res.status(401).send({ error })
    }

}

