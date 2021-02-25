const logger = require("./logger");

function errorHandler(error, request, response, next) {
  logger.error(error.message);

  if (error.name === "ValidationError") {
    return response.status(400).send({ error: "Missing data" });
  }

  next(error);
}

module.exports = errorHandler;
