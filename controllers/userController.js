const { default: mongoose } = require("mongoose");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECERT, { expiresIn: "3d" });
};
// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.status(200).json({ name: user.name, email, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const signupUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.signup(name, email, password);
    const token = createToken(user._id);
    res.status(200).json({ name: user.name, email, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  const id = req.user._id.toString();
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "no such user found" });
  }
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "no such user found" });
  }
  res
    .status(200)
    .json({
      username: user.name,
      followers: user.followers.length,
      following: user.following.length,
    });
};
const followUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "no such user found" });
  }
  const followuser = await User.findOneAndUpdate(
    { _id: id },
    { $push: { followers: id } }
  );
  const user = await User.findOneAndUpdate(
    { _id: req.user._id.toString() },
    { $push: { following: id } }
  );

  if (!followuser) {
    return res.status(404).json({ message: "no such user found" });
  }
  return res.status(200).json({ message: "User followed Successfully" });
};

const unfollowUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "no such user found" });
  }
  const followuser = await User.findOneAndUpdate(
    { _id: id },
    { $pull: { followers: id } }
  );
  const user = await User.findOneAndUpdate(
    { _id: req.user._id.toString() },
    { $pull: { following: id } }
  );

  if (!followuser) {
    return res.status(404).json({ message: "no such user found" });
  }
  return res.status(200).json({ message: "User unfollowed Successfully" });
};
module.exports = { loginUser, signupUser, followUser, unfollowUser, getUser };
