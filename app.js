// app.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const helmet = require("helmet");
const httpStatus = require("http-status");
const { authRouter, charityRouter, donorRouter, donationRouter, webHookRouter } = require("./routers");
const { connectDB, initializeData } = require('./config/dbConfig');

const app = express();
const SERVER_PORT = process.env.SERVER_PORT || 3000;

const startApp = async () => {
  try {
    // Connect to DB
    await connectDB();

    // Check if we need to initialize data
    if (process.argv[2] === "init-data") {
      await initializeData();
      process.exit(0);
    }

    // CORS setup
    const whitelistedCors = [
      `http://localhost:${SERVER_PORT}`,
      'http://localhost:5173',
    ];

    // Middleware setup
    app.use(helmet()); // Set security-related HTTP headers
    app.use(cors({
      origin: (origin, callback) => {
        if (whitelistedCors.includes(origin) || !origin) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    }));
    const API_PREFIX = '/charitan/api/v1';
    app.use(`${API_PREFIX}/webhook`, express.raw({ type: 'application/json' }), webHookRouter);
    app.use(cookieParser()); // Parse cookies
    app.use(bodyParser.json()); // Parse JSON bodies
    app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
    app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

    // Basic test route
    app.get(`${API_PREFIX}`, (req, res) => {
      return res.status(httpStatus.OK).json({ message: "Hello world! Server is running well" });
    });

    // Routes setup with prefix
    app.use(`${API_PREFIX}/auth`, authRouter);
    app.use(`${API_PREFIX}/charities`, charityRouter);
    app.use(`${API_PREFIX}/donors`, donorRouter);
    app.use(`${API_PREFIX}/donation`, donationRouter);

    // Error handling middleware
    const errorHandler = (err, req, res, next) => {
      console.error(err);
      return res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
        error: err.message,
      });
    };

    // Global error handler
    app.use(errorHandler);

    // Start the server
    app.listen(SERVER_PORT, () => {
      console.log(`Server running on port ${SERVER_PORT}`);
      console.log(`Swagger docs available at http://localhost:${SERVER_PORT}/api-docs`);
    });

  } catch (err) {
    console.error('Error during initialization:', err);
    process.exit(1);
  }
};

startApp();
