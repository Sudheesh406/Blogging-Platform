const User = require("../models/userSchema");
const Blog = require('../models/blogSchema')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//----------------------CREATE USER---------------------------//
const secretKey = "newuser123";
const createUser = async (req, res) => {
    const { email, username, password } = req.body;
    let Blogs = await displayHome();  

  try { 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists.");
      return res.status(400).render("create", { existingUser });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ username, email, password: hashedPassword })

      .then((result) => {
        let acessToken = jwt.sign(
          {
            id: result.id,
            role: result.role,
          },
          secretKey,
          { expiresIn: "24h" }
        );
        res.cookie("token", acessToken);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log("User created.");
    res.redirect("/home")
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user.");
  }
};

//--------------------------USER-ACESS--------------------------//
async function acessCancel (id){
  try {
    const response = await User.findByIdAndUpdate(
      id,
      { status: false },
      {
        new: true,
      }
    );
    if (response) {
      console.log("user blocked...");
    } else {
      console.log("User not found for Block...");
    }
  } catch (error) {
    console.log(error);
  }
};

async function acessApprove (id){
  try {
    const response = await User.findByIdAndUpdate(
      id,
      { status: true },
      {
        new: true,
      }
    );
    if (response) {
      console.log("acess approved...");
    } else {
      console.log("user not found...");
    }
  } catch (error) {
    console.error(error);
  }
};

const displayHome = async () => {
      const Blogs = await Blog.find().populate("author", "username");
      return Blogs  
  };

  async function homeRender (req,res){
    let Blogs =  await displayHome()
    let id = req.user.id
    let user = await User.findById(id)
    let username=user.username
    res.render('home',{Blogs,username})
    }

//-----------------------LOGIN USER------------------------------//
const loginUser = async (req, res) => {
    let Blogs = await displayHome();  
  const { email, password } = req.body;

  try {
    const valid = await User.findOne({ email: email });

    if (!valid) {
      const errorFound = 1;
      console.log("User not found.");
      return res.status(404).render("login", { errorFound });
    } else if (valid.role == "admin") {
      const correctPassword = await bcrypt.compare(password, valid.password);
      if (!correctPassword) {
        const errorFound = 1;
        console.log("invalid password");
        return res.status(401).render("login", { errorFound });
      } else {
        let acessToken = jwt.sign(
          {
            id: valid.id,
            role: valid.role,
          },
          secretKey,
          { expiresIn: "24h" }
        );
        console.log("Login successfully...");
        res.cookie("token", acessToken);
        res.redirect("/admin");
      }
    } else {
      if (valid.status == false) {
        const errorFound = 2;
        console.log("bloked user");
        return res.status(401).render("login", { errorFound });
      } else {
        const correctPassword = await bcrypt.compare(password, valid.password);
        if (!correctPassword) {
          const errorFound = 1;
          console.log("invalid password");
          return res.status(401).render("login", { errorFound });
        } else {
          let acessToken = jwt.sign(
            {
              id: valid.id,
              role: valid.role,
            }, 
            secretKey,
            { expiresIn: "24h" }
          );
          let username = valid.username
          console.log("Login successfully...");
          res.cookie("token", acessToken);
          res.redirect("/home");
        }
      }
    }
  } catch (error) {
    console.error("Error to login:", error);
    res.status(500).send("Error login user.");
  }
};

//------------------------active && unActive---------------------//
 async function unActive (req, res){
    const id = req.params.id;
    acessCancel(id);
    res.redirect("/admin");
  };
  
  async function active(req, res){
    const id = req.params.id;
    acessApprove(id);
    res.redirect("/admin");
  };
  
// ------------------------------LOGOUTUSER---------------------------//
const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};

module.exports = {
  createUser,
  loginUser,
  secretKey,
  logoutUser,
  acessCancel,
  acessApprove,
  unActive,
  active,
  homeRender
};
