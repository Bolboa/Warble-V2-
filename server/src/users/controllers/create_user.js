const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const Boom = require("boom");
const create_token = require("../util/token.js").create_token;
const nodemailer = require("nodemailer");


/*
Hash function for encrypting password.
*/
const hash_password = async (password) => {

	// Generate random salt.
	let salt = await bcrypt.genSalt(10);

	// Hash the password using the salt.
	let hash = await bcrypt.hash(password, salt);
	return hash;
}


/*
Send a verification email to the user.
*/
const email_verification = async (email, token) => {

  // Send email via the SMTP protocol.
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.WARBLE_USER,
      pass: process.env.WARBLE_PASSWORD
    }
  });

  // Email description.
  let mail_options = {
    from: process.env.WARBLE_USER,
    to: "ebolboa@gmail.com",
    subject: "Warble",
    html: `Click the link: <a href="http://localhost:${process.env.PORT}/${token}">here</a>`
  }

  // Send the email.
  try {
    return transporter.sendMail(mail_options);
  } catch(err) {
    throw Boom.badRequest(err);
  }
  
}


/*
Create a new user.
*/
exports.create = async (req, h) => {

  console.log("here1");
  console.log(req.pre.user);
	// Define new user.
	const user = await new User();
	user.username = req.payload.username;
	user.email = req.payload.email;


	// Hash the password.
	await hash_password(req.payload.password)
	.then(hash => {
		user.password = hash;
	}, err => {
		throw Boom.badRequest(err);
	});


	// Save the user to the database.
	try {
		user.save();
	} catch (err) {
		throw Boom.badRequest(err);
  }
  
  // Generate a JWT token.
  const token = await create_token(user);

  // Send an email using the JWT token as verification.
  await email_verification(user.email, token);
  
	// Success, send the JWT token back as a response.
	return h.response({ id_token: token }).code(201);

}






