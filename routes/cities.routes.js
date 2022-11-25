const express = require("express");
const router = express.Router();
const City = require("../models/City.model");
const Memento = require("../models/Memento.model")
const Review = require("../models/Review.model")
const fileUploader = require("../helpers/cloudinary")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("home", {currentUser:req.session.currentUser});
});

router.get("/new", (req, res, next) => {
  res.render("cities/createCity", {currentUser:req.session.currentUser});
});

router.post("/new", fileUploader.single('image'), (req, res, next) => {
  const { _id } = req.session.currentUser;
  const { name, location, description  } = req.body;
  const newObject = { name, location, owner: _id, description}
  if (req.file){
    newObject["image"] = req.file.path
  }
  City.create( newObject)
    .then((city) => {
      //cambiar a la ruta del perfil
      res.redirect("/");
    })
    .catch((err) => {
      res.render("cities/createCity", {currentUser:req.session.currentUser});
    });
});

router.get("/:id/edit", (req, res, next) => {
  City.findById(req.params.id)
    .then((city) => {
      if (city == null) {
        return res.redirect("/city");
      }
      res.render("cities/editCity" , {currentUser:req.session.currentUser, city});
    })
    .catch((err) => {
      res.redirect("/city");
    });
});
router.post("/:id/edit", fileUploader.single("image"), (req, res, next) => {
  const { id } = req.params;
  const { owner, ...restBody } = req.body;
  
  if (req.file){
    console.log("hayq ue ve",req.file.path)
    restBody["image"] = req.file.path
  }
  console.log(restBody)
  City.findByIdAndUpdate(id, restBody, { new: true })
    .then((city) => {
      res.redirect(`/city/${id}/detail`);
    })
    .catch((err) => {
      res.render("cities/editCity", { _id: id, ...restBody, currentUser:req.session.currentUser });
    });
});

router.get("/:id/detail", async (req, res, next) => {
  //to change async await neddeed mementos y reviews
 try{
  const {id} = req.params
  const {_id} = req.session.currentUser
  const city = await City.findById(id)
  if (city == null) {
    return res.redirect("/city");
  }
  const mementos = await Memento.find({ownerCity:id, owner:_id})
  const reviews = await Review.find({ownerCity: id, owner:_id})
      res.render("cities/cityDetail", {city, mementos, reviews, currentUser:req.session.currentUser})
 }catch(err){
  res.redirect("/city");
 }

});

router.get("/:id/delete", (req, res, next) => {
    City.findByIdAndDelete(req.params.id)
    .then((city) => {
      res.redirect("/");
    })
    .catch((err) => {
      res.redirect("/city");
    });
});
module.exports = router;
