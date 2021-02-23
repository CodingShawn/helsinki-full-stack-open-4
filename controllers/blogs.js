const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  let notes = await Blog.find({});
  response.status(200).json(notes);
});

blogsRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);
  let savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

module.exports = blogsRouter;
