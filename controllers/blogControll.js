const Blog = require("../models/blogSchema");

//--------------------CREATE BLOG-------------------------//
const createBlog = async (req, res) => {
  const { title, content } = req.body;
  const id = req.user.id;
  try {
    let response = await Blog.create({ title, content, author: id });
    if (response) {
      console.log("Blog created");
      res.status(200).redirect("/home");
    } else {
      console.log("Blog creation failed...");
      return res.status(400).send("Required fields missing.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error Blog creating.");
  }
};

// --------------------DISPLAY BLOG------------------------//
const displayMyPage = async (req, res) => {
  try {
    const Blogs = await Blog.find({ author: req.user.id });
    res.render("mypage", { Blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).send("Error loading blogs...");
  }
};

const displayAdminPage = async (req, res) => {
  try {
    const Blogs = await Blog.find().populate("author", "username status");
    res.render("admin", { Blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).send("Error loading blogs...");
  }
};

// -------------------BLOG DELETE FOR USER------------------------//
const deleteBlogUser = async (req, res) => {
  const id = req.params.id;
  console.log("id", id);

  try {
    let response = await Blog.findOne({ _id: id });
    if (response) {
      await Blog.deleteOne({ _id: response.id });
      console.log("Deleted successfully...");
      res.redirect("/mypage");
    } else {
      res.status(404).send("Blog not found...");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error Blog Deleting...");
  }
};

// --------------------BLOG DELETE FOR ADMIN--------------------------//
const deleteBlogAdmin = async (req, res) => {
  const id = req.params.id;
  console.log("id", id);

  try {
    let response = await Blog.findOne({ _id: id });
    if (response) {
      await Blog.deleteOne({ _id: response.id });
      console.log("Deleted successfully...");
      res.redirect("/admin");
    } else {
      res.status(404).send("Blog not found...");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error Blog Deleting...");
  }
};

// ---------------------------BLOG-------------------------------//
let editingId;
const displayBlog = async (req, res) => {
  const id = req.params.id;
  editingId = id;

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
};

// -----------------------EDIT BLOG ---------------------------//
const editBlog = async (req, res) => {
  const updates = req.body;
  console.log("edit person :", req.user.role);

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(editingId, updates, {
      new: true,
    });
    if (updatedBlog) {
      if (req.user.role == "admin") {
        res.status(200).redirect("/admin");

      } else {
        res.status(200).redirect("/mypage");
      }
    } else {
      res.status(404).send("Blog not found...");
    }
  } catch (error) {
    console.error("Error editing blog:", error);
    res.status(500).send("Error editing blog...");
  }
};

module.exports = {
  displayBlog,
  displayMyPage,
  displayAdminPage,
  createBlog,
  editBlog,
  deleteBlogAdmin,
  deleteBlogUser
};
