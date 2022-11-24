const express = require("express");
const router = express.Router();
const fileUploader = require("../helpers/cloudinary")

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// GET /auth/signup
router.get("/signup", isLoggedOut,(req, res) => {
  res.render("auth/signup");
});

// POST /auth/signup
router.post("/signup", isLoggedOut, (req, res) => {
  const { name, lastName, username, city, age, email, password, _id } = req.body;
  // Check that username, email, and password are provided
  if (username === "" || email === "" || password === "") {
    res.status(400).render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });
    return;
  }
  if (password.length < 8) {
    res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
    return;
  }
  // Create a new user - start by hashing the password
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      // Create a user and save it in the database
      return User.create({
        name, 
        lastName, 
        username, 
        city, 
        age, 
        email, 
        password : hashedPassword });
    })
    .then((user) => {
      req.session.currentUser = user.toObject();
      res.render("users/user-detail", {currentUser:req.session.currentUser})

    })
    .catch((error) => {
      console.log("error",error);
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "Username and email need to be unique. Provide a valid username or email.",
        });
      } else {
        next(error);
      }
    });
});

// GET /auth/login
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

// POST /auth/login
router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, email, password } = req.body;

  // Check that username, email, and password are provided
  if (username === "" || email === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage:
        "All fields are mandatory. Please provide username, email and password.",
    });
    return;}

  // - either length based parameters or we check the strength of a password
  if (password.length < 6) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });}

  // Search the database for a user with the email submitted in the form
  User.findOne({ email })
    .then((user) => {
      // If the user isn't found, send an error message that user provided wrong credentials
      if (!user) {
        res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
        return; }
      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt
        .compare(password, user.password)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            res
              .status(400)
              .render("auth/login", { errorMessage: "Wrong credentials." });
            return;}
          // Add the user object to the session object
          req.session.currentUser = user.toObject();
          // Remove the password field
          delete req.session.currentUser.password;
          //render detail user
          res.redirect("/")
        })
        .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
    })
    .catch((err) => next(err));
});

// GET /auth/logout
router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("auth/logout", { errorMessage: err.message });
      return;
    }
    res.redirect("/");
  });
});

// GET route to retrieve and display all the users
router.get('/list', (req, res) => {
  User.find()
  .then((users)=>{
   res.render('users/users', {User: users});      
  })
  .catch(err=>console.log(err));
});

// GET route to retrieve and display a specif user
router.get('/list/user', (req, res) => {
  const {_id} = req.session.currentUser
  User.findById(_id)
  .then((users)=>{
    console.log("uno",users);
   res.render('users/user-one', {User:users, currentUser:req.session.currentUser});      
  })
  .catch(err=>console.log(err));
});

//GET auth id AND EDIT
router.get("/list/:_id/edit", async (req,res, next)=>{
  try{
      const {_id} = req.params
      //1. Obtener los datos de DB (database)
      const data = await User.findById(_id);
      res.render("users/user-edit",data)
  }catch(err){
      res.redirect("/list")
  }
})

//UPDATE USER POST
router.post("/list/:_id/edit",fileUploader.single('image'), async (req,res)=>{
  try{
  const {_id} = req.params
  const {password, username, email, ...restBody} = req.body
  if (req.file){
    restBody["image"] = req.file.path
  }
  const dataU = await User.findByIdAndUpdate(_id, restBody, {new:true})
  req.session.currentUser = dataU
  res.redirect(`/`);
}catch(err){

}
})

//detail user after edit
router.get("/:_id",async (req,res)=>{
  const data = await User.findById(req.params._id);
  res.render("users/user-detail", data)
})

//Delet user
router.post("/list/:_id/delete", (req,res)=>{
  const {_id} = req.params
  User.findByIdAndDelete(_id)
      .then(()=>res.redirect("/auth/list"))
      .catch(console.log)
})


module.exports = router;
