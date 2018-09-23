const create_user = require("../controllers/create_user");
const verify_unique_user = require("../util/user_function.js").verify_unique_user;


/*
Route for creating a user.
*/
module.exports = { method: "POST",
	path: "/users/register",
	config: 
    { auth: false,
      pre: [{ method: verify_unique_user}],
      handler: create_user.create }
}