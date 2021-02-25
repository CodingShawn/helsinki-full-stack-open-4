const express = require("express");
const app = express();
const blogRouter = require('./controllers/blogs');
const cors = require("cors");
const mongoose = require("mongoose");
const config = require('./utils/confiq')
const errorHandler = require('./utils/middleware')

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogRouter);
app.use(errorHandler);

module.exports = app;
