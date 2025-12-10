const axios = require("axios");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");

const API_KEY = process.env.API_KEY;
const BASE_URL = "https://imdb8.p.rapidapi.com";

if (!API_KEY) {
  return next(
    new AppError("API_KEY is not defined in environment variables", 500)
  );
}

// Helper to call RapidAPI
const callRapidAPI = async (endpoint, params = {}) => {
  try {
    const options = {
      method: "GET",
      url: `${BASE_URL}/${endpoint}`,
      params,
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "imdb8.p.rapidapi.com",
      },
      timeout: 10000, // 10 seconds timeout
    };

    const response = await axios.request(options);

    if (response.data?.error) {
      return next(new AppError(response.data.error, 400));
    }

    if (!response.data) {
      return next(new AppError("No data returned from RapidAPI", 404));
    }

    return response.data;
  } catch (err) {
    if (err.response) {
      const status = err.response.status || 500;
      const message =
        err.response.data?.message ||
        err.response.data?.error ||
        "RapidAPI request failed";

      return next(new AppError(message, status));
    }

    console.error("RapidAPI error:", err.message);
    return next(new AppError("Failed to connect to RapidAPI", 5003));
  }
};

// Get all movies (simulate "all" by fetching multiple pages)
exports.getMoviesByPage = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;

  if (page < 1) {
    return next(new AppError("Page number must be at least 1", 400));
  }

  // A list of letters to simulate pages
  const letters = [..."abcdefghijklmnopqrstuvwxyz"];

  if (page > letters.length) {
    return res.status(400).json({
      status: "error",
      message: "Page limit exceeded",
    });
  }

  const q = letters[page - 1]; // pick the letter based on page

  const data = await callRapidAPI("auto-complete", { q });

  res.status(200).json({
    status: "success",
    page,
    query_used: q,
    results: data.d?.length || 0,
    data: data.d || [],
  });
});

// Get movies by search query
exports.getMovies = asyncHandler(async (req, res, next) => {
  const searchQuery = req.query.q?.trim();

  if (!searchQuery) {
    return next(new AppError("Please provide a search query", 400));
  }

  if (searchQuery.length < 2) {
    return next(
      new AppError("Search query must be at least 2 characters long", 400)
    );
  }

  const data = await callRapidAPI("auto-complete", { q: searchQuery });

  res.status(200).json({
    status: "success",
    results: data.d?.length || 0,
    data: data.d || [],
  });
});

// Get movie details by ID
exports.getMovieById = asyncHandler(async (req, res, next) => {
  const movieId = req.params.id?.trim();

  if (!movieId) {
    return next(new AppError("Movies id is required", 400));
  }

  // Validate IMDb ID format
  if (!/^tt\d{7,8}$/.test(movieId)) {
    return next(new AppError("Invalid IMDb ID format.", 400));
  }

  const data = await callRapidAPI("title/get-overview-details", {
    tconst: movieId,
  });

  if (!data || Object.keys(data).length === 0) {
    return next(new AppError("Movie not found", 404));
  }

  res.status(200).json({
    status: "success",
    data,
  });
});
