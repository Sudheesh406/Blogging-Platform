const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const Blog = require("../models/blogSchema")

//---------------CREATE USER DETAILS----------------//

const createUser = async(req,res)=>{
    const { email, username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log("User already exists.");
            return res.status(400).render("create",{existingUser})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, email,password: hashedPassword });
        console.log("User created.");
        res.render('home'); 
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Error creating user.");
    }
}

//---------------------LOGIN USER------------------//

const loginUser = async(req,res)=>{
    const {username,password} = req.body;
        try {
            const userFound = await User.findOne({username})
            if(!userFound){
                const errorFound = 1
                console.log("User not found.");
                return res.status(404).render("login",{errorFound})
            } else if (userFound.role == 'admin'){
                res.redirect("admin")
            }else{
            const correctPassword = await bcrypt.compare(password, userFound.password);
            if(!correctPassword){
                const errorFound = 1
                console.log("invalid password");
                return res.status(401).render("login",{errorFound})
            }else{
                console.log("Login successfully...");
                res.redirect("home")
            }
        }
        } catch (error) {
            console.error("Error to login:", error);
            res.status(500).send("Error login user.");
        }  
        }
    

//-------------------BLOG SAVE-------------------//

    const createBlog = async(req,res)=>{
        const {title,content} =req.body
        try {
          let response =  await Blog.create({title,content});
          if(response){
            res.status(200).render('home')
            console.log("Blog created");
            console.log({title});
          }else{
            console.log("Blog creation failed...")
            return res.status(400).send("Required fields missing.");
          }
        } catch (error) {
            console.log(error);
            res.status(500).send("Error Blog creating.");
        }
    }


module.exports = {createUser,loginUser,createBlog}
  