const jwt=require('jsonwebtoken');
const Library=require('../models/librarys');

const auth=async(req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        const verifyUser=jwt.verify(token,"iamabadboyandsheisgoodgorlandshenameisxyvjhdkdhka")
        // console.log(verifyUser)
        const user=await Library.findOne({_id:verifyUser._id})
        // console.log(user);

        req.token=token;
        req.user=user; 
        next();
    }catch(err)
    {
        res.status(401).send(err);
    }
}

module.exports=auth;