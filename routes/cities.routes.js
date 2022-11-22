const express = require("express");
const router = express.Router();
const City = require("../models/City.model");
/* GET home page */
router.get("/", (req, res, next) => {
  res.send("test ruta cities");
});

router.get("/new", (req, res, next) => {
  res.render("cities/createCity");
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
      res.render("cities/editCity", city);
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
      res.redirect("/city");
    })
    .catch((err) => {
      res.render("cities/editCity", { _id: id, ...restBody });
    });
});

router.get("/:id/detail", (req, res, next) => {
  //to change async await neddeed mementos y reviews
    City.findById(req.params.id)
    .then((city) => {
      if (city == null) {
        return res.redirect("/city");
      }
      console.log("detalle", city)
      res.render("cities/cityDetail", city)
    })
    .catch((err) => {
      res.redirect("/city");
    });
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
