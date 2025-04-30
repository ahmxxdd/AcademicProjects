// Import required modules and controllers
import express from "express";  // Import express framework
import { protectRoute } from "../middleware/protectRoute.js";  // Import middleware for route protection (authentication)
import { 
  createPost, 
  deletePost, 
  commentOnPost, 
  likeUnlikePost, 
  getAllPosts, 
  getLikedPosts, 
  getFollowingPosts, 
  getUserPosts 
} from "../controllers/post.controller.js";  // Import functions for handling post operations

// Create an instance of the Express router
const router = express.Router();

// Route to get all posts, accessible only by authenticated users
router.get("/all", protectRoute, getAllPosts);

// Route to get posts of users that the authenticated user is following
router.get("/following", protectRoute, getFollowingPosts);

// Route to get liked posts by a user, identified by their ID
router.get("/likes/:id", protectRoute, getLikedPosts);

// Route to get posts of a specific user, identified by their username
router.get("/user/:username", protectRoute, getUserPosts);

// Route to create a new post, only accessible by authenticated users
router.post("/create", protectRoute, createPost);

// Route to like or unlike a post, identified by its ID, accessible by authenticated users
router.post("/like/:id", protectRoute, likeUnlikePost);

// Route to comment on a post, identified by its ID, accessible by authenticated users
router.post("/comment/:id", protectRoute, commentOnPost);

// Route to delete a post, identified by its ID, accessible by authenticated users
router.delete("/:id", protectRoute, deletePost);

// Export the router to be used in other parts of the application
export default router;
