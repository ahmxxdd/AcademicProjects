// Import required modules and controllers
import express from "express";  // Import express
import { protectRoute } from "../middleware/protectRoute.js";  // Import the protectRoute middleware to protect routes
import { deleteNotifications, getNotifications } from "../controllers/notification.controller.js";  // Import the controller functions for handling notifications

// Create an instance of the Express router
const router = express.Router();

// Define route for getting notifications
// This route is protected, so the user must be authenticated to access their notifications
router.get("/", protectRoute, getNotifications);

// Define route for deleting notifications
// This route is also protected, so only authenticated users can delete their notifications
router.delete("/", protectRoute, deleteNotifications);

// Export the router to be used in other parts of the application
export default router;
