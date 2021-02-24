const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const initialBlogs = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save(0);
});

test("Blogs are returned as JSON", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("All blogs are returned", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(2);
});

test("Blog has unique identifier property named id", async () => {
  const response = await api.get("/api/blogs");
  const firstPost = response.body[0];
  expect(firstPost.id).toBeDefined();
});

test("POST request to /api/blogs returns 201 status as well as content type application-json", async () => {
  let newBlog = initialBlogs[4];
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);
});

test("Total number of blogs increase by 1 after POST request to /api/blogs", async () => {
  let response = await api.get("/api/blogs");
  let initialNumBlogs = response.body.length;

  let newBlog = initialBlogs[5];
  await api.post("/api/blogs").send(newBlog);

  response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(initialNumBlogs + 1);
});

test("Blog content saved after POST request is correct", async () => {
  let newBlog = initialBlogs[5];
  await api.post("/api/blogs").send(newBlog);
  let response = await api.get("/api/blogs");

  expect(response.body[response.body.length - 1].title).toBe("Type wars");
});

test("If likes property missing from request, likes will default to 0", async () => {
  let newBlog = {
    title: "You don't know JS",
    author: "Kyle Simpson",
    url: "https://github.com/getify/You-Dont-Know-JS"
  }

  let response = await api.post("/api/blogs").send(newBlog);
  expect(response.body.likes).toBe(0);
})

afterAll(() => {
  mongoose.connection.close();
});
