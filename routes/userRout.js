const express = require("express");
const router = express.Router();
const { createUser, loginUser,logoutUser,active,unActive,homeRender} = require("../controllers/userControll");
const { displayBlog, displayMyPage, displayAdminPage,
  createBlog, editBlog, deleteBlogAdmin, deleteBlogUser } = require("../controllers/blogControll");
const { render } = require("ejs");
const authentication = require("../middlewares/auth");

// -------------------LOGIN PAGE-------------------------//
router.get("/", (req, res) => {
  res.render("login", { errorFound:false})}); 
router.post("/", loginUser);  
router.get("/logout",logoutUser);

//-----------------------NEW-USER---------------------------//
router.get("/create", (req, res) => {
  res.render("create", {
    existingUser: false})});  
router.post("/home", createUser);

//-----------------------HOME PAGE---------------------------//
router.get("/home", authentication, homeRender);

//------------------------NEW BLOG-----------------------------//
router.get("/write", (req, res) => {
  res.render("write")});
router.post("/write", authentication, createBlog);

//----------------USER-PAGE  ADMIN-PAGE-----------------------//
router.get("/mypage", authentication, displayMyPage, (req, res) => {
  res.render("mypage")});
router.get("/admin", authentication, displayAdminPage);

//-----------USER-EDIT-DELETE   ADMIN-EDIT-DELETE---------------//
router.get("/edit/:id", authentication, displayBlog);
router.get("/rewrite/:id", authentication, displayBlog);
router.post("/edit", authentication, editBlog);
router.get("/delete/:id", authentication, deleteBlogUser);
router.get("/clear/:id", authentication, deleteBlogAdmin);
router.get("/active/:id", authentication, active);
router.get("/unActive/:id", authentication, unActive);

module.exports = router;
