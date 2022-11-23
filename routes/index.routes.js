const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/",  (req, res, next) => {
  if ( !{currentUser:req.session.currentUser}){
    res.render("users/user-detail", {currentUser:req.session.currentUser});
  }else{
    res.render("home")
  }
});

module.exports = router;
