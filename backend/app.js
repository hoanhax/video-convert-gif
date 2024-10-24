const express = require("express");
const cors = require("cors");
const routes = require("./routers");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", routes);

module.exports = app;