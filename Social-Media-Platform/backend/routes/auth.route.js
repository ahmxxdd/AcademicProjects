// Import required modules and controllers
import express from "express";
import { getMe, login, logout, signup } from "../controllers/auth.controller.js";  // Import the controller functions
import { protectRoute } from "../middleware/protectRoute.js";  // Import the protectRoute middleware

// Create an instance of the Express router
const router = express.Router();

// Define route for getting the authenticated user's data
// This route is protected, so the user must be authenticated
router.get("/me", protectRoute, getMe);

// Define route for user signup, where the user provides their information to create an account
router.post("/signup", signup);

// Define route for user login, where the user provides credentials to authenticate
router.post("/login", login);

// Define route for user logout, where the user is logged out by clearing the token
router.post("/logout", logout);

// Export the router to be used in other parts of the application
export default router;
