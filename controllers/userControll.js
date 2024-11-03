const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

//----------------------CREATE USER---------------------------//
const secretKey = "newuser123";
const createUser = async(req,res)=>{
    const { email, username, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User already exists.");
            return res.status(400).render("create",{existingUser})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email,password: hashedPassword })
    .then((result) => {
    let acessToken = jwt.sign({
            id:result.id,
            role:result.role    
        },secretKey,{ expiresIn: '24h' })
        res.cookie("token",acessToken)
    }).catch((err) => {
      console.log(err);  
    });;
        console.log("User created.");
        res.redirect('/home');
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Error creating user.");
    }
}

//------------------------ACESS CANCEL---------------------//
    let holdUser = null;
 const acessCancel = async (id)=>{
    try{ 
     holdUser = await User.findOne({_id:id});
     if (!holdUser) {
        console.log("User not found for hold.");
    } else {
        console.log("User hold:", holdUser);
    } 
 }catch(error){
    console.log(error);
}   
 }    
const acessApprove = async (id)=>{
    if (holdUser && holdUser.id === id) {
        holdUser = null;
        console.log("User access approved and hold released.");
    }else{
        console.log("not matching....");  
    }
}

//-----------------------LOGIN USER------------------------------//
const loginUser = async(req,res)=>{
    const {email,password} = req.body;
        try {
            const valid = await User.findOne({email:email})
            if(!valid){
                const errorFound = 1
                console.log("User not found.");
                return res.status(404).render("login",{errorFound})

            }else if (holdUser && valid._id.toString() === holdUser._id.toString()) {
                const errorFound = 2
                console.log("Acess Denied");
                return res.status(401).render("login",{errorFound})

            } else if (valid.role == 'admin'){ 
                const correctPassword = await bcrypt.compare(password, valid.password);
                if(!correctPassword){
                    const errorFound = 1
                    console.log("invalid password");
                    return res.status(401).render("login",{errorFound})

                }else {
                    let acessToken = jwt.sign({
                        id:valid.id,
                        role:valid.role
                    },secretKey,{ expiresIn: '24h' })            
                    console.log("Login successfully...");
                    res.cookie("token",acessToken)
                res.redirect("admin")
          }

            }else{
            const correctPassword = await bcrypt.compare(password, valid.password);
            if(!correctPassword){
                const errorFound = 1
                console.log("invalid password");
                return res.status(401).render("login",{errorFound})

            }else{
                let acessToken = jwt.sign({
                    id:valid.id,
                    role:valid.role
                },secretKey,{ expiresIn: '24h' })            
                console.log("Login successfully...");
                res.cookie("token",acessToken)
                res.redirect("home")
            }
        }    
        
        } catch (error) {
            console.error("Error to login:", error);
            res.status(500).send("Error login user.");
        }  
        }
    
// ------------------------------LOGOUTUSER---------------------------//        
        const logoutUser = (req,res)=>{  
            res.clearCookie("token");
            res.redirect("/")
        }

module.exports = {createUser,loginUser,secretKey,logoutUser,acessCancel,acessApprove}