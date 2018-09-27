const Boom = require("boom");
const bcrypt = require("bcryptjs");
const User = require("../models/User.js");


/*
Check if a user already exists within a database.
*/
const verify_unique_user = async (req, h) => {

  // Check if email or username exists.
  const user = await User.findOne({
    $or: [{email: req.payload.email}, {username: req.payload.username}]
  });

  console.log(user);
  // If user is found.
  if (user) {
    
    // Check if username exists.
    if (user.username === req.payload.username) {
      throw Boom.badRequest("Username taken!");
    }

    // Check if email exists.
    if (user.email === req.payload.email) {
      throw Boom.badRequest("Email taken!");
    }
  }
  
  // If everything checks out, we send the user
  // to the handler.
  return req.payload;
}


/*
Authenticate a user.
*/
const verify_credentials = async (req, h) => {

  // Check if email or username exists.
  const user = await User.findOne({
    $or: [{email: req.payload.email}, {username: req.payload.username}]
  });

  // User is not found.
  if (!user) {
    throw Boom.badRequest("Incorrect email or username");
  }

  // Check if password matches.
  const is_valid = await bcrypt.compare(req.payload.password, user.password);
  
  if (is_valid) {
    return user;
  }

  // Password does not match.
  throw Boom.badRequest("Incorrect password");
}


module.exports = {
  verify_unique_user: verify_unique_user,
  verify_credentials: verify_credentials
};









