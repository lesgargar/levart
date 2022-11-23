const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("users/user-detail", {currentUser:req.session.currentUser});
  });

module.exports = router   