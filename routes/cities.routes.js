const express = require("express");
const router = express.Router();
const City = require("../models/City.model");
const Memento = require("../models/Memento.model")
const Review = require("../models/Review.model")
/* GET home page */
router.get("/", (req, res, next) => {
  res.render("home");
});

router.get("/new", (req, res, next) => {
  res.render("cities/createCity", {currentUser:req.session.currentUser});
});

router.post("/new", (req, res, next) => {
  const { _id } = req.session.currentUser;
  const { name, location } = req.body;
  City.create({ name, location, owner: _id })
    .then((city) => {
      //cambiar a la ruta del perfil
      res.redirect("/city");
    })
    .catch((err) => {
      res.render("cities/createCity");
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
router.post("/:id/edit", (req, res, next) => {
  const { id } = req.params;
  const { owner, ...restBody } = req.body;
  City.findByIdAndUpdate(id, restBody, { new: true })
    .then((city) => {
      res.redirect(`/city/${id}/detail`);
    })
    .catch((err) => {
      console.log(err)

      res.render("cities/editCity", { _id: id, ...restBody });
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
      res.render("cities/cityDetail", {city, mementos, reviews})
 }catch(err){
  res.redirect("/city");
 }

});

router.get("/:id/delete", (req, res, next) => {
    City.findByIdAndDelete(req.params.id)
    .then((city) => {
      res.redirect("/city");
    })
    .catch((err) => {
      res.redirect("/city");
    });
});
module.exports = router;
