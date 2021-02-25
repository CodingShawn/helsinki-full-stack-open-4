const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  let notes = await Blog.find({});
  response.status(200).json(notes);
});

blogsRouter.post("/", async (request, response, next) => {
  request.body.likes = request.body.likes || 0;
  const blog = new Blog(request.body);
  try {
    let savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (exception) {
    next(exception);
  }
});

module.exports = blogsRouter;
