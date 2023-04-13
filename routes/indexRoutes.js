const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");
const {
  createPost,
  deletePost,
  likePost,
  unlikePost,
  commentPost,
  getPost,
  getPosts,
} = require("../controllers/postController");
const {
    loginUser,
    signupUser,
    followUser,
    unfollowUser,
    getUser,
  } = require("../controllers/userController");
//  user routes
//  authenticate 
  router.post("/authenticate", loginUser);
//  signup new user
  router.post("/signup", signupUser);
// get a user profile
  router.get("/user", requireAuth, getUser);
// follow a user
  router.post("/follow/:id", requireAuth, followUser);
//   unfollow a user
  router.post("/unfollow/:id", requireAuth, unfollowUser);

//post routes
// get all posts
router.get("/all_posts/", requireAuth, getPosts);
// get a specific post
router.get("/posts/:id", requireAuth, getPost);
// create a new post
router.post("/posts/", requireAuth, createPost);
// like a post
router.patch("/like/:id", requireAuth, likePost);
// dislike a post
router.patch("/dislike/:id", requireAuth, unlikePost);
// comment a post
router.patch("/comment/:id", requireAuth, commentPost);
// delete a post
router.delete("/posts/:id", requireAuth, deletePost);

module.exports = router;
