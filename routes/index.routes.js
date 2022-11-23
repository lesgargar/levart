const express = require('express');
const router = express.Router();
const Memento = require("../models/Memento.model");
const City = require("../models/City.model");
/* GET home page */
router.get("/",  async(req, res, next) => {
  try{
   
    const {_id} = req.session.currentUser
    const cities = await City.find({owner:_id})
   
    if ( req.session.currentUser){
      res.render("users/user-detail", {cities, currentUser:req.session.currentUser  })
    }else{
      res.render("home")
    }
   }catch(err){
    res.render("home")
}

});


module.exports = router;
