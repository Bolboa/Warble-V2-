const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const user_schema = new Schema({
	first_name: { type: String, required: true },
	last_name: { type: String, required: true },
	username: { type: String, required: true, index: { unique: true } },
	email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  active: { type: Boolean, default: false, required: true },
	admin: { type: Boolean, default: false, required: true}
});

module.exports = mongoose.model('User', user_schema);

