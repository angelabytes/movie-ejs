const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");

const { getAllMovies, updateMovie, createMovie, newMovieForm, editMovieForm, deleteMovie } = require("../controllers/movie");

router.get("/", getAllMovies);

router.get("/edit/:id", editMovieForm);

router.get("/new", newMovieForm);

router.post("/new", createMovie);

router.post("/update/:id", updateMovie);

router.post("/delete/:id", deleteMovie);

module.exports = router;