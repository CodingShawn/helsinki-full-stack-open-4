const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  let body = await request.body;

  if (body.password.length < 3) {
    return response.status(401).json({error: 'Password must be at least 3 characters long'})
  }

  const saltRounds = 10;
  const passwordHash = bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });
  try {
    const savedUser = await user.save();
    response.json(savedUser);
  }
  catch(exception) {
    next(exception)
  }
});

usersRouter.get("/", async (request, response) => {
  let users = await User.find({});
  response.status(200).json(users);
});

module.exports = usersRouter;
