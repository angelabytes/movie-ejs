const Movie = require('../models/Movie');
const parseValidationErrors = require("../utils/parseValidationErr");

const getAllMovies = async (req, res) => {
    const userId = req.user._id;
    const movies = await Movie.find({ createdBy: userId }).sort("createdAt");
    res.render("movies", { movies });
}

const newMovieForm = async (req, res) => {
    res.render("movie", { movie: null });
}

const editMovieForm = async (req, res) => {
    const movieId = req.params.id;
    const userId = req.user._id;

    const movie = await Movie.findOne({ _id: movieId, createdBy: userId });
    if (!movie) {
        req.flash("error", "Movie was not found!");
        console.log(`movie id: ${movieId}`);
        return res.redirect("/movies");
    }
    res.render("movie", { movie });
}

const createMovie = async (req, res) => {
    const { title, director, year, plot } = req.body;
    const userId = req.user._id;

    try {
        const movie = await Movie.create({
            title,
            director,
            year,
            plot,
            createdBy: userId,
        });
        req.flash("success", "Movie has been added.");
        res.redirect("/movies");
    } catch (error) {
        if (error.name === "ValidationError") {
            parseValidationErrors(error, req);
            console.log(error);
            res.render("movie", { movie: req.body });
        } else {
            req.flash("error", "An unexpected error occurred.");
            console.log(error);
            res.redirect("/movies");
        }
    }
}

const updateMovie = async (req, res) => {
    const { title, director, year, plot } = req.body;
    const userId = req.user._id;
    const movieId = req.params.id;

    try {
        const movie = await Movie.findOneAndUpdate(
            { _id: movieId, createdBy: userId },
            { title, director, year, plot },
            { new: true, runValidators: true }
        );

        if (!movie) {
            req.flash("error", "Movie was not found or could not be edited.");
            return res.redirect("/movies");
        }

        req.flash("success", "Movie has been updated.");
        res.redirect("/movies");
    } catch (error) {
        if (error.name === "ValidationError") {
            parseValidationErrors(error, req);
            console.log(error);
            req.flash("error", "Could not update.");
            res.redirect(`/movies/edit/${movieId}`);
        } else {
            req.flash("error", "An unexpected error occured during the update.");
            console.log(error);
            res.redirect("movies");
        }
    }
}

const deleteMovie = async (req, res) => {
    const movieId = req.params.id;
    const userId = req.user._id;


    try {
        const movie = await Movie.findOneAndDelete({
            _id: movieId,
            createdBy: userId,
        });

        if (!movie) {
            req.flash("error", "Movie was not found or could not be deleted.");
        } else {
            req.flash("success", "Movie has been deleted.");
        }
    } catch (error) {
        req.flash("error", "An upexpected error occured during deletion.");
        console.error(error);
    }

    res.redirect("/movies");
}

module.exports = {
    getAllMovies,
    newMovieForm,
    createMovie,
    editMovieForm,
    updateMovie,
    deleteMovie
}