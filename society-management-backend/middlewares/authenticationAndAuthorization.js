require("dotenv").config();

exports.auth = async( req , res , next) => {
    try{
        const token = req.body.token || req.cookies.token || req.headers.authorization.split(' ')[1];        
          if (!token){
            res.status(401).json({
                message:"You are not authenticated user",
                success:false                
            })
          }
          const decode  = await jwt.verify(token , process.env.JWT_SECRET);

          req.user=decode;
          next(); 

    }


    catch(err){
        res.status(401).json({
            message : "Ulla lla laa lee oooo",
            success:false
        })
    }

}