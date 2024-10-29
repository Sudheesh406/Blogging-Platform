const express = require('express')
const router = express.Router()
const {createUser,loginUser,createBlog} = require('../controllers/userControll');
const { render } = require('ejs');

//------------LOGIN PAGE------------//

router.get("/", (req, res) => {
    res.render("login",
      {errorFound :false}
    )
 });

 router.get("/login",(req,res)=>{
   res.render("login")
 })

 router.post("/",loginUser)

 router.get("/logout",(req,res)=>{
   res.render("login",{errorFound:false})
})

//---CREATE BUTTON TO CREATENEW PAGE----//

 router.get("/create",(req,res)=>{
   res.render("create",{
      existingUser:false
   })
   });
 
   router.post("/create",createUser);

//-----------HOME PAGE-------------//

router.get("/home" , (req,res)=>
   {res.render('home')
   })

 //--------------ADD BLOG------------//  

 router.get("/add",(req,res)=>{
    res.render("add")
 })

 router.post("/add",createBlog)

//----------MY-PAGE------------//

router.get("/mypage",(req,res)=>{
   res.render("mypage")
})

//-----------admin------------//

router.get("/admin",(req,res)=>{
   res.render("admin")
})

 module.exports = router;