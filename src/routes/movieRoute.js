const express = require("express");
const router = express.Router();
const movieController = require("../controller/movieController");

// Route to get all movies (with optional pagination)
router.get("/", movieController.getMoviesByPage);

// Route to get movies by search query
router.get("/search", movieController.getMovies);

// Route to get movie details by ID
router.get("/:id", movieController.getMovieById);

module.exports = router;
