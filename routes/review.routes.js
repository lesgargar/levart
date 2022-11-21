const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// Require the User model in order to interact with the database
const Review = require("../models/Review.model");

// GET /auth/signup
router.get("/create", (req, res) => {
  res.render("create/createReview");
});

router.post("/create", async (req, res, next) => {
    try{
        const { date, creator,review } = req.body;
        console.log(req.body);
        const newReview = await Review.create({
            date, 
            creator, 
            review 
        })
        res.redirect("/")
    }catch(err){
        console.log(err);
    }
    
})   

module.exports = router;
