const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const initialBlogs = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save(0);
})

test('Blogs are returned as JSON', async() => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('All blogs are returned', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(2);
})

test('Blog has unique identifier property named id', async() => {
  const response = await api.get('/api/blogs');
  const firstPost = response.body[0];
  expect(firstPost.id).toBeDefined();
})

afterAll(() => {
  mongoose.connection.close();
})