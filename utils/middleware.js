const logger = require("./logger");

function errorHandler(error, request, response, next) {
  logger.error(error.message);

  if (error.name === "ValidationError") {
    return response.status(400).send({ error: "Inappropriate data" });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json( {
      error: 'Invalid token'
    })
  }

  next(error);
}

module.exports = errorHandler;
