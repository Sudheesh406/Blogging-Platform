const Blog = require("../models/blogSchema")
const user = require('../controllers/userControll');
//-------------------BLOG SAVE-------------------//

const createBlog = async(req,res)=>{
    const {title,content} = req.body
    console.log(content);
    const id = req.user.id;
    console.log(id,"userId");
   try {
      let response =  await Blog.create({title,content,author:id});
      if(response){
        res.status(200).redirect('home')
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



// ------------------DISPLAY BLOG-------------------

    const displayBlogHome = async(req,res)=>{
        try {
            const Blogs = await Blog.find(); 
            res.render('home', { Blogs }); 
        } catch (error) {
            console.error("Error fetching blogs:", error);
            res.status(500).send("Error loading blogs...");
        }
    }

    const displayBlogMyPage = async(req,res)=>{
        try {
            const Blogs = await Blog.find({author:req.user.id});
            res.render('mypage', { Blogs }); 
        } catch (error) {
            console.error("Error fetching blogs:", error);
            res.status(500).send("Error loading blogs...");
        }
    }

// ----------------DELETE BLOG--------------------

const deleteBlog = async (req,res)=>{
    const id = req.params.id;
    console.log("id",id)
    try {
        let response = await Blog.findOne({_id:id})
        if(response){
           await Blog.deleteOne({_id : response.id})
           console.log(response,"response");
           console.log(id,"id");
           console.log("Deleted successfully...")
           res.redirect("/mypage"); 
        }else{
            res.status(404).send("Blog not found...");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error Blog Deleting...");
    }
}

// --------------------EDITING PAGE--------------------

let editingId;
const editingpage = async(req,res)=>{
    const id = req.params.id;
    editingId = id
    try {
        const blog = await Blog.findById(id);
        if (blog) {
            res.render("edit", { blog }); 
        } else {
            res.status(404).send("Blog not found...");
        }
    } catch (error) {
        console.error("Error fetching blog:", error);
        res.status(500).send("Error fetching blog...");
    }
}

// ----------------------UPDATED BLOG -------------------

const editBlog = async (req, res) => {
    const updates = req.body;
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(editingId, updates, { new: true });
        if (updatedBlog) {
            res.status(200).redirect("mypage") 
        } else {
            res.status(404).send("Blog not found...");
        }
    } catch (error) {
        console.error("Error editing blog:", error);
        res.status(500).send("Error editing blog...");
    }
};

module.exports = {createBlog,displayBlogHome,editingpage,displayBlogMyPage,editBlog,deleteBlog}