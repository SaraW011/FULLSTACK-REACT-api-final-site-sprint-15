require("dotenv").config();
// protect against DoS attacks:
const rateLimit = require("express-rate-limit");
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const { celebrate, Joi, Segments, errors } = require("celebrate");
const bodyParser = require("body-parser");
const { requestLogger, errorLogger } = require("./middleware/logger");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const { createUser, login } = require("./controllers/users");
const auth = require("./middleware/auth");
const validateURL = require("./middleware/validateURL");

// const path = require("path");

const app = express();
const { PORT = 3000 } = process.env;

// connect to MongoDB server
mongoose.connect("mongodb://localhost:27017/aroundb");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use(helmet());

app.use(requestLogger);

// support parsing of application/json type post data:
app.use(bodyParser.json());
/* enables all domain req, not just your own,
which can be a major security risk for your users... */
app.use(cors());
app.options("*", cors()); // enable requests for all routes

/* some routes don't require auth
for example, register and login: */

// new route via auth:
app.use("/users", auth, usersRouter);
app.use("/cards", auth, cardsRouter);
// Localhost 3000 message:

// eslint-disable-next-line consistent-return
app.get("/", (res, err) => {
  res.send("You've been served!");
  if (err.name === "CastError") {
    return res.status(404).json({ message: "Resource not found. Invalid ID" });
  }
});

// Implementing a Temporary Authorization Solution by hardcoding (from postman):
// app.use((req, res, next) => {
//   req.user = {
//     _id: "62948a0e7e0fe1d83c2358cc",
//   };

//   next();
// });

/* Server crash testing, app automatically recovers if crash,
allows to follow other route without restarting the app manually on the server:
(remove after review) */
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.post(
  "/signin",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login
);

// Pass routs to the corresponding controllers:
app.post(
  "/signup",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(200),
      avatar: Joi.string().custom(validateURL),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser
);

/* The error logger needs to be enabled
after the route handlers and before the error handlers */

//* ***********************************/
// CENTRALIZED ERROR HANDLERS:

app.use(errorLogger);
app.use(errors()); // celebrate error handler

// default err >> avoid undefined error:
app.use((err, req, res, next) => {
  // if an error has no status, display 500
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    // check the status and display a message based on it
    message:
      statusCode === 500 ? "An error has occurred on the server" : message,
  });
});

app.listen(PORT, () => {
  console.log(
    `\u001B[32mHi cookie, your app is listening on port ${PORT};\u001B[32m`
  );
});
