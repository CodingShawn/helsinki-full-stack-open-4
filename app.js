const express = require("express");
const app = express();
const blogRouter = require("./controllers/blogs");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/confiq");
const errorHandler = require("./utils/middleware");
const usersRouter = require("./controllers/users");

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogRouter);
app.use("/api/users", usersRouter);
app.use(errorHandler);

module.exports = app;
