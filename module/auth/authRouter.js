const express = require("express");
const authRouter = express.Router();
const {
  login,
} = require("./authController");

authRouter.post("/login", login);

module.exports = authRouter;