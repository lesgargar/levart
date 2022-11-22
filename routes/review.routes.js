const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// Require the User model in order to interact with the database
const Review = require("../models/Review.model");

// GET route to retrieve and display all the reviews
router.get('/list', (req, res) => {
    //1. Traer los datos de la base de datos
    //Los metodos usados con mongoose nos dan una Promise
    Review.find()
    .then((reviews)=>{
        console.log("Lista de reviews",reviews);
     //2. UNA VEZ que tenemos los datos mandalos al templete
     res.render('list/reviews', {Review: reviews});      
    })
    .catch(err=>console.log(err));
});


// GET /review/create
router.get("/create", (req, res) => {
  res.render("create/createReview");
});

//POST CREAR REVIEW
router.post("/create", async (req, res, next) => {
    try{
        const { date, owner, ownerCity, review } = req.body;
        console.log(req.body);
        const newReview = await Review.create({
            date, 
            owner,
            ownerCity,
            review 
        })
        res.redirect("/")
    }catch(err){
        console.log(err);
    }
    
})   

//Obtener REVIEW por id y editar
router.get("/list/:_id/edit", async (req,res, next)=>{
    try{
        
        const {_id} = req.params
        //1. Obtener los datos de DB (database)
        const data = await Review.findById(_id);
        console.log("filtro", data);
        res.render("edit/review-edit",data)
    }catch(err){
        res.redirect("/list")
    }
})

//Ruta para actualizar el libro

// router.post("/books/:idLibro/edit", async (req,res)=>{
//     console.log("Datos", req.body);
//     const {idLibro} = req.params
//     const libroActualizado = await Book.findByIdAndUpdate(idLibro, req.body)
//     console.log(libroActualizado);
//     res.redirect(`/books/${idLibro}`);
    
// })

module.exports = router;
