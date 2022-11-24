const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// Require the User model in order to interact with the database
const Review = require("../models/Review.model");
const City = require("../models/City.model");


// GET route to retrieve and display all the reviews
router.get('/list', (req, res) => {
    //1. Traer los datos de la base de datos
    //Los metodos usados con mongoose nos dan una Promise
    Review.find()
    .then((reviews)=>{
     //2. UNA VEZ que tenemos los datos mandalos al templete
     res.render('reviews/reviews', {Review: reviews, currentUser:req.session.currentUser});      
    })
    .catch(err=>console.log(err));
});

// GET /review/create
router.get("/:idCity/create-review", (req, res) => {
   // const {idCity} = req.session.currentUser
  res.render("reviews/createReview", {id:req.params.idCity, currentUser:req.session.currentUser});
});

//POST /review/create
router.post("/:idCity/create-review", async (req, res, next) => {
    try{
  const {_id} = req.session.currentUser
        const {idCity} = req.params
        const { date, review } = req.body;
        const newReview = await Review.create({
            date, 
            owner:req.session.currentUser._id,
            ownerCity:idCity,
            review 
        })
        
      res.redirect(`/city/${idCity}/detail`)
        // Review.find()
        // .then((reviews)=>{
        // res.render('users/user-detail', {Review: reviews, currentUser:req.session.currentUser}); 
        // })
    }catch(err){
        console.log(err);
    }
})   

// GET route to retrieve and display all the reviews
router.get('/list', (req, res) => {
    Review.find()
    .then((reviews)=>{
     res.render('reviews/reviews', {Review: reviews, currentUser:req.session.currentUser});      
    })
    .catch(err=>console.log(err));
  });

//Obtener REVIEW por id 
router.get("/list/:_id/detail", async (req,res, next)=>{
    try{
        const {_id} = req.params
        const data = await Review.findById(_id);
        res.render("reviews/review-details", {currentUser:req.session.currentUser,data})
    }catch(err){
        res.redirect("/list")
    }
})


//Obtener REVIEW por id y editar
router.get("/list/:_id/edit", async (req,res, next)=>{
    try{
        const {_id} = req.params
        const data = await Review.findById(_id);
        res.render("reviews/review-edit",{currentUser:req.session.currentUser,data})
    }catch(err){
        res.redirect("/list")
    }
})

//Update review
router.post("/list/:_id/edit", async (req,res)=>{
    const {_id} = req.params
    const data = await Review.findByIdAndUpdate(_id, req.body)
    console.log(data);
    Review.find()
    .then((reviews)=>{
     res.render('reviews/reviews', {Review: reviews, currentUser:req.session.currentUser});      
    })
    .catch(err=>console.log(err));
})

//Delet review
router.post("/list/:_id/delete", (req,res)=>{
    const {_id} = req.params
    Review.findByIdAndDelete(_id)
        .then(()=>res.redirect("/review/list"))
        .catch(console.log)
  })

module.exports = router;
