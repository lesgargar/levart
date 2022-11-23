const express = require('express');
const router = express.Router();
const Memento = require("../models/Memento.model")

/* GET home page */
router.get("/", (req, res, next) => {
  res.send("test ruta memento");
});
router.get("/:idMemento/edit", (req, res, next)=>{
  
    Memento.findById(req.params.idMemento)
    .then((memento) => {
      if (memento == null) {
        return res.redirect("/city");
      }
      res.render("mementos/editMemento", memento,{currentUser:req.session.currentUser});
    })
    .catch((err) => {
      res.redirect("/city");
    });
})

router.post("/:idMemento/edit", (req, res, next) => {
  const { idMemento } = req.params;
  const { owner, ownerCity, ...restBody } = req.body;
  Memento.findByIdAndUpdate(idMemento, restBody, { new: true })
    .then((mementoUpdated) => {
      res.redirect(`/city/${mementoUpdated.ownerCity}/detail`);
    })
    .catch((err) => {
      res.render("mementos/editMemento", { currentUser:req.session.currentUser, _id: idMemento, ...restBody });
    });
});


router.post("/:idCity/new", (req, res, next) => {
  const {idCity} = req.params
  const {_id} = req.session.currentUser
  const {name, description} = req.body
  Memento.create({name, description, owner:_id, ownerCity:idCity})
  .then((memento)=>{
    res.redirect(`/city/${idCity}/detail`,{currentUser:req.session.currentUser})
  })
  .catch((err)=>{ 
    res.redirect(`/city/${idCity}/detail`)})
});

router.get("/:idMemento/delete/:idCity", (req, res, next)=>{
  const {idCity, idMemento} = req.params
  Memento.findByIdAndDelete(idMemento)
  .then(()=>{
    res.redirect(`/city/${idCity}/detail`,{currentUser:req.session.currentUser})
  })
  .catch((err)=>{ res.redirect(`/city/${idCity}/detail`)})
})




module.exports = router;
