const { Post, Comment } = require("../models/postModel");
const { default: mongoose } = require("mongoose");
const createPost = async (req, res) => {
  const { title, description } = req.body;
  const emptyfields = [];
  if (!title) {
    emptyfields.push("title");
  }
  if (!description) {
    emptyfields.push("description");
  }
  if (emptyfields.length > 0) {
    return res
      .status(400)
      .json({ message: "Please fill all the fields", fields: emptyfields });
  }
  try {
    const userid = req.user._id.toString();
    const post = await Post.create({ title, description, userid });

    res.status(200).json({
      postid: post._id,
      title,
      description,
      createdtime: post.createdAt,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const userid = req.user._id.toString();
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "no such post found" });
  }
  const post = await Post.findOneAndDelete({ _id: id, userid });

  if (!post) {
    return res.status(404).json({
      message:
        "no such post found or you are not authorized to delete the post",
    });
  }
  res.status(200).json({ message: "Post succefully deleted" });
};

const likePost = async (req, res) => {
  const { id } = req.params;
  const userid = req.user._id.toString();
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "no such post found" });
  }
  const likedbefore = await Post.findOne({ _id: id, likes: userid });

  if (likedbefore) {
    return res.status(404).json({ message: "user have already liked" });
  }
  const post = await Post.findOneAndUpdate(
    { _id: id },
    { $push: { likes: userid }, $pull: { dislikes: userid } }
  );
  if (!post) {
    return res.status(404).json({ message: "no such post found" });
  }
  res.status(200).json({ message: "liked post succefully" });
};

const unlikePost = async (req, res) => {
  const { id } = req.params;
  const userid = req.user._id.toString();
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "no such post found" });
  }
  const dislikedbefore = await Post.findOne({ _id: id, dislikes: userid });
  if (dislikedbefore) {
    return res.status(404).json({ message: "user have already disliked" });
  }

  const post = await Post.findOneAndUpdate(
    { _id: id },
    { $pull: { likes: userid }, $push: { dislikes: userid } }
  );
  if (!post) {
    return res.status(404).json({ message: "no such post found" });
  }
  res.status(200).json({ message: "disliked post succefully" });
};
const commentPost = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  if (!comment) {
    return res.status(404).json({ message: "comment can't be empty" });
  }
  const userid = req.user._id.toString();
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "no such post found" });
  }
  const newcomment = await Comment.create({ comment, userid });
  const post = await Post.findOneAndUpdate(
    { _id: id },
    { $push: { comments: { comment, userid } } }
  );
  if (!post) {
    return res.status(404).json({ message: "no such post found" });
  }
  res.status(200).json({ commentid: newcomment._id });
};

const getPost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "no such post found" });
  }
  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json({ message: "no such post found" });
  }
  res.status(200).json({
    postid: post._id,
    likes: post.likes.length,
    dislikes: post.dislikes.length,
  });
};
const getPosts = async (req, res) => {
  const posts = await Post.find({});
  res.status(200).json(posts);
};
module.exports = {
  createPost,
  deletePost,
  likePost,
  unlikePost,
  commentPost,
  getPost,
  getPosts,
};
