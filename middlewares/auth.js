const jwt = require('jsonwebtoken');
require("dotenv").config()
const authentication = async(req,res,next)=>{

    let token = req.cookies?.token
      if(!token){
          res.redirect("/")
      }else{
          const User =  jwt.verify(token,process.env.SECRET_KEY); 

                if(User){
                    req.user = User;
                    next();
                }else{
                    res.redirect("/")
                }
      }
}


module.exports = authentication    