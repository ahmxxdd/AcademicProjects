// Import required modules and controllers
import express from 'express';  // Import express framework
import { protectRoute } from '../middleware/protectRoute.js';  // Import middleware for route protection (authentication)
import { 
  followUnfollowUser, 
  getUserProfile, 
  getSuggestedUsers, 
  updateUser 
} from '../controllers/user.controller.js';  // Import functions for handling user-related operations

// Create an instance of the Express router
const router = express.Router();

// Route to get a user's profile by their username, only accessible by authenticated users
router.get("/profile/:username", protectRoute, getUserProfile);

// Route to get a list of suggested users for the authenticated user to follow
router.get("/suggested", protectRoute, getSuggestedUsers);

// Route to follow or unfollow a user, identified by their ID, only accessible by authenticated users
router.post("/follow/:id", protectRoute, followUnfollowUser);

// Route to update the authenticated user's profile information
router.post("/update", protectRoute, updateUser);

// Export the router to be used in other parts of the application
export default router;
