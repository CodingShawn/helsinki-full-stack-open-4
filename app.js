const express = require("express");
const app = express();
const blogRouter = require("./controllers/blogs");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/confiq");
const middleware = require("./utils/middleware");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

app.use(cors());
app.use(express.json());
app.use(middleware.getTokenFrom);
app.use("/api/blogs", blogRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use(middleware.errorHandler);

module.exports = app;
