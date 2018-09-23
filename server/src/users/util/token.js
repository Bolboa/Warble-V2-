const axios = require("axios");
const Boom = require("boom");
const jwt = require("jsonwebtoken");

// Access environment variables.
require("dotenv").config();


/*
Create a signed token using Auth0.
*/
const create_token = async (user) => {

  let scope;

  if (user.admin) {
    scope = "admin";
  }

  // Options for signing a token.
  return jwt.sign(
    { id: user._id,
      username: user.username,
      scope: scope },
    process.env.JWT_SECRET,
    { algorithm: "HS256",
      expiresIn: "1h" }
  );

}

module.exports = {
  create_token: create_token
};