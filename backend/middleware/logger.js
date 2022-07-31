// record of requests to the server
const winston = require("winston");
const expressWinston = require("express-winston");

// create a request logger in JSON format
const requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: "request.log" })],
  format: winston.format.json(),
});

// creating error logger in JSON format
const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: "error.log" })],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
