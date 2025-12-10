const express = require("express");
require("dotenv").config();
const AppError = require("./utils/appError");
const cors = require("cors");
const app = express();
const errorHandler = require("./middleware/errorHandler");
const movieRoute = require("./routes/movieRoute");

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cors());
app.use("/videos", (req, res, next) => {
  res.send("Videos endpoint");
});

// Routes
app.use("/movies", movieRoute);

// Handle undefined routes
app.all("/*splat", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(errorHandler);
module.exports = app;
