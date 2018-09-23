const verify_credentials = require("../util/user_function.js").verify_credentials;
const create_token = require("../util/token.js").create_token;

/*
Route for authenticating a user.
*/
module.exports = { method: "POST",
	path: "/users/authenticate",
	config: 
    { auth: false,
      pre: [{ method: verify_credentials, assign: "user" }],
      handler: async (req, h) => {

        // User the pre-handler to return the user informaton 
        // along with a signed JWT token.
        return h.response({ id_token: await create_token(req.pre.user) }).code(201);

      }
    }
}