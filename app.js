// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

//const moment= require(moment)
// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const capitalize = require("./utils/capitalize");
const projectName = "Levart";

app.locals.appTitle = `${capitalize(projectName)} `;

hbs.registerPartials(__dirname + "/views/partials");

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const mementoRoutes = require("./routes/memento.routes");
app.use("/memento", mementoRoutes);

const reviewRoutes = require("./routes/review.routes");
app.use("/review", reviewRoutes);

const citiesRoutes = require("./routes/cities.routes");
app.use("/city", citiesRoutes);

const profileRoutes = require("./routes/profile.routes");
app.use("/profile", profileRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
