const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  let blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.status(200).json(blogs);
});

blogsRouter.post(
  "/",
  middleware.userExtractor,
  async (request, response, next) => {
    request.body.likes = request.body.likes || 0;

    try {
      const body = request.body;

      const user = request.user;

      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user.id,
      });

      let savedBlog = await blog.save();
      user.blogs = user.blogs.concat(savedBlog.id);
      await user.save();

      response.status(201).json(savedBlog);
    } catch (exception) {
      next(exception);
    }
  }
);

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const returnedBlog = await Blog.findById(request.params.id);

    const user = request.user;
    if (returnedBlog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndDelete(request.params.id);
      response.status(204).end();
    } else {
      return response
        .status(401)
        .json({ error: "You do not have permission to delete this" });
    }
  }
);

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    likes: body.likes,
  };

  let updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.status(200).json(updatedBlog);
});

blogsRouter.post("/:id/comments", async (request, response) => {
  const body = request.body;
  let comment = body.comments;

  let targetedBlog = await Blog.findById(request.params.id);
  console.log(targetedBlog);
  let commentsArray = targetedBlog.comments;
  let updatedCommentsArray = commentsArray.concat(comment);
  targetedBlog.comments = updatedCommentsArray;
  let updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    targetedBlog,
    { new: true }
  );
  response.status(201).json(updatedBlog);
});

module.exports = blogsRouter;
