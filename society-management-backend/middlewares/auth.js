import jwt from "jsonwebtoken";
import "dotenv/config";

// middlewares/auth.js
export const auth = (req,res,next)=>{
  try{

    console.log("Cookies:", req.cookies);
    console.log("Auth Header:", req.headers.authorization);

    const token =req.headers.authorization?.split(" ")[1] || req.body?.token || req.cookies?.token ;

    console.log("TOKEN:", token);

    if(!token){
      return res.status(401).json({
        success:false,
        message:"Token missing"
      })
    }

    console.log("SERVER TIME:", Math.floor(Date.now()/1000));

const dec = jwt.decode(token);
console.log("TOKEN IAT:", dec?.iat);
console.log("TOKEN EXP:", dec?.exp);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = decoded;
    next();



    /*                  
    {
  id: 35,
  email: 'ambargoyal3@gmail.com',
  role: 'admin',
  iat: 1773499249,
  exp: 1773506449
}
    
decoded kuch aisa dikhta haiii biirrrrrorooo
    */
  }
  catch(error){
    console.log("Auth Middleware Error:", error);

    return res.status(401).json({
      success:false,
      message:"Invalid token"
    })
  }
}

export const isAdmin = (req,res,next)=>{
  try{

    if(req.user.role === "admin"){
      next();
    }
    else{
      return res.status(403).json({
        success:false,
        message:"Protected route for admin only"
      })
    }

  }
  catch(err){
    return res.status(500).json({
      success:false,
      message:"Role verification failed"
    })
  }
}


export const isResident = (req,res,next)=>{
  try{

    if(req.user.role === "resident"){
      next();
    }
    else{
      return res.status(403).json({
        success:false,
        message:"Protected route for residents only"
      })
    }

  }
  catch(err){
    return res.status(500).json({
      success:false,
      message:"Role verification failed"
    })
  }
}


// Note: There's a duplicate isAdmin function here. The second one will override the first.
// You should remove one of them. I've kept both but the second will be the one exported.
export const isAdminDuplicate = async (req,res,next)=>{
  try{
    const role = req.user.role ;
    
  if(role!=='admin')
  {
    return res.status(401).json({
      success:false,
      message:"You are not authorized as it for admin only."
    })
  }
 
  next();
  }


  catch(err){
     return res.status(401).json({
      success:false,
      message:"Error in authentication middleware .."
    })
 
  }
  



}