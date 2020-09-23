require("dotenv").config();
require("./config/dbConnection");

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

/**
 * Middlewares
 */
// const corsOptions = { origin: process.env.FRONTEND_URL, credentials: true };
// app.use(cors(corsOptions));
app.use(
  cors({
    origin : process.env.FRONTEND_URL,
    credentials:true,
  })
)

// test

app.use(logger("dev")); // This logs HTTP reponses in the console.
app.use(express.json()); // Access data sent as json @req.body
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

// Test to see if user is logged In before getting into any router.
app.use(function (req, res, next) {
  console.log(req.session.currentUser);
  next();
});

/**
 * Routes
 */

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const eventsRouter = require("./routes/events");
const sportsRouter = require("./routes/sports");
const usersRouter = require("./routes/users");

app.use("/", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/events", eventsRouter);
app.use("/api/sports", sportsRouter);
app.use("/api/user", usersRouter);

app.use((req, res, next) => {
  // If no routes match, send them the React HTML.
  res.sendFile(__dirname + "/public/index.html");
});

module.exports = app;
