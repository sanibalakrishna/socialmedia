const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const commentSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  userid: {
    type: String,
    required: true,
  },
});

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "A Post should have a title"],
    },
    description: {
      type: String,
      required: [true, "A Post should have a description"],
    },
    likes: {
      type: [String],
      default: [],
    },
    dislikes: {
      type: [String],
      default: [],
    },
    userid: {
      type: String,
      required: true,
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  { timestamps: true }
);
const Post = mongoose.model("Post", postSchema);
const Comment = mongoose.model("Comment", commentSchema);
module.exports = { Post, Comment };
