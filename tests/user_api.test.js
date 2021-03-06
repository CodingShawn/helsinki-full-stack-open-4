const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');

beforeEach(async () => {
  await User.deleteMany({});
})

test('User will not be created if password is less than 3 characters', async () => {
  let user = {
    "username": "pwdshort",
    "name:": "pwd",
    "password" : "1"
  }
  
  let response = await api
    .post('/api/users')
    .send(user)
    .expect(401)
  
  expect(response.body).toStrictEqual({error: 'Password must be at least 3 characters long'})
})

afterAll(() => {
  mongoose.connection.close();
});
