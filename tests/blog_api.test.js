const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const initialBlogs = require("./test_helper");

const api = supertest(app);

let token;

beforeAll(async () => {
  let newUser = {
    username: "testuser",
    name: "pwd",
    password : "pwd123"
}

await api
    .post("/api/users")
    .send(newUser)

  let loginDetails = {
    username: "testuser",
    password: "pwd123"
}
  let loginResponse = await api
                .post("/api/login")
                .send(loginDetails)
  token = loginResponse.body.token;
})

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = initialBlogs[0];
  await api
  .post("/api/blogs")
  .set('Authorization', "bearer " + token)
  .send(blogObject)
  blogObject = initialBlogs[1];
  await api
  .post("/api/blogs")
  .set('Authorization', "bearer " + token)
  .send(blogObject)
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
    .set('Authorization', "bearer " + token)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);
});

test("Total number of blogs increase by 1 after POST request to /api/blogs", async () => {
  let response = await api.get("/api/blogs");
  let initialNumBlogs = response.body.length;

  let newBlog = initialBlogs[5];
  await api
    .post("/api/blogs")
    .set('Authorization', "bearer " + token)
    .send(newBlog);

  response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(initialNumBlogs + 1);
});

test("Blog content saved after POST request is correct", async () => {
  let newBlog = initialBlogs[5];
  await api.post("/api/blogs").set('Authorization', "bearer " + token).send(newBlog);
  let response = await api.get("/api/blogs");

  expect(response.body[response.body.length - 1].title).toBe("Type wars");
});

test("If likes property missing from request, likes will default to 0", async () => {
  let newBlog = {
    title: "You don't know JS",
    author: "Kyle Simpson",
    url: "https://github.com/getify/You-Dont-Know-JS"
  }

  let response = await api.post("/api/blogs").set('Authorization', "bearer " + token).send(newBlog);
  expect(response.body.likes).toBe(0);
})

test("If title missing from request, will respond with status code 400", async () => {
  let newBlog = {
    author: "Missing title author",
    url: "www.missingtitle.com",
    likes: 0
  }
  await api
    .post("/api/blogs")
    .set('Authorization', "bearer " + token)
    .send(newBlog)
    .expect(400)
})

test("If url missing from request, will respond with status code 400", async () => {
  let newBlog = {
    title: "Missing URL",
    author: "Missing url author",
    likes: 0
  }
  await api
    .post("/api/blogs")
    .set('Authorization', "bearer " + token)
    .send(newBlog)
    .expect(400)
})

test("Able to delete post", async () => {
  const responseAtStart = await api.get("/api/blogs");
  let blogToDelete = responseAtStart.body[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', "bearer " + token)
    .expect(204)

  const responseAtEnd = await api.get("/api/blogs");

  let content = responseAtEnd.body.map(blog => blog.title);

  expect(content).not.toContain(blogToDelete.content)
})

test("Returns 401 when token not provided", async () => {
  await api
    .post("/api/blogs")
    .send(initialBlogs[2])
    .expect(401)
})

test("Able to update post", async () => {
  const responseAtStart = await api.get("/api/blogs");
  let blogToUpdate = responseAtStart.body[0];

  const blog = {
    likes: 10
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blog)
    .expect(200)

  const responseAtEnd = await api.get("/api/blogs");
  let updatedBlog = responseAtEnd.body[0];
  expect(updatedBlog.likes).toBe(10);
})

afterAll(() => {
  mongoose.connection.close();
});
