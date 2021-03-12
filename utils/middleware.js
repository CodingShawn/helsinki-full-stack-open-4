const logger = require("./logger");

function errorHandler(error, request, response, next) {
  logger.error(error.message);

  if (error.name === "ValidationError") {
    return response.status(400).send({ error: "Inappropriate data" });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({
      error: "Invalid token",
    });
  }

  next(error);
}

function getTokenFrom(request, response, next) {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    const token = authorization.substring(7);
    request.token = token;
  }
  next();
}

module.exports = { errorHandler, getTokenFrom };
