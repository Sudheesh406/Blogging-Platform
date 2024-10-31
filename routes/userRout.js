const express = require('express')
const router = express.Router()
const {createUser,loginUser} = require('../controllers/userControll');
const {createBlog,displayBlogHome,displayBlogMyPage,editingpage,editBlog,deleteBlog} = require('../controllers/blogControll')
const { render } = require('ejs');
const authentication  = require("../middlewares/auth")


//------------LOGIN PAGE------------//

router.get("/",(req,res) => {
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
 
   router.post("/home",createUser);

//-----------HOME PAGE-------------//

router.get("/home",authentication,displayBlogHome)

 //--------------BLOG ADD OR EDIT------------//  

 router.get("/write",(req,res)=>{
    res.render("write")
 })

 router.post("/write",authentication,createBlog)

//----------MY-PAGE------------//

router.get("/mypage",authentication,displayBlogMyPage,(req,res)=>{
   res.render("mypage")
})
router.post("/edit",editBlog);


//-----------admin------------//

router.get("/admin",authentication,(req,res)=>{
   res.render("admin")
})

router.get("/edit/:id", authentication,editingpage);
router.get("/delete/:id", authentication, deleteBlog);



 module.exports = router;