const jwt = require('jsonwebtoken');
// const user = require('../controllers/userControll')

require("dotenv").config()
console.log(process.env.SECRET_KEY);
const authentication = async(req,res,next)=>{
    let cookie = req.cookies?.token
    if(!cookie){
        res.redirect("/")
    }else{
        const user = await jwt.verify(cookie,process.env.SECRET_KEY);  
        if(user){
            req.user = user;
            next();
        }else{
            res.redirect("/")
        }
    }
}

// const logout = (req,res,next)=>{  
//     // let cookie = req.cookies?.token
//     res.clearCookie("token");
//     res.end()
//     next()
// }

module.exports = authentication    