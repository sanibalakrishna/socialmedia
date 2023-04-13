const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  followers: {
    type: [String],
    default: [],
  },
  following: {
    type: [String],
    default: [],
  },
});

userSchema.statics.signup = async function (name, email, password) {
  if (!name || !email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Please enter a valid Email");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Please enter a strong Passwod");
  }
  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("Email address already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await this.create({ name, email, password: hash });
  return user;
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("Please ensure all fields are filled");
  }
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect Email");
  }
  const passwordmatch = await bcrypt.compare(password, user.password);
  if (!passwordmatch) {
    throw Error("Incorrect Password");
  }
  return user;
};
module.exports = mongoose.model("User", userSchema);
