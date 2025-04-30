// Import necessary modules and routes
import express from "express";  // Import the Express framework for handling HTTP requests
import authRoutes from "./routes/auth.route.js";  // Import authentication-related routes
import userRoutes from "./routes/user.route.js";  // Import user-related routes
import postRoutes from "./routes/post.route.js";  // Import post-related routes
import notificationRoutes from "./routes/notification.route.js";  // Import notification-related routes
import dotenv from "dotenv";  // Import dotenv to manage environment variables
import connectMongoDB from "./db/connectMongoDB.js";  // Import MongoDB connection function
import cookieParser from "cookie-parser";  // Import cookie parser to handle cookies
import path from "path";  // Import path to handle file paths
import { v2 as cloudinary } from "cloudinary";  // Import cloudinary for image/file management

// Configure environment variables
dotenv.config();  // Load environment variables from the .env file

// Cloudinary configuration for handling file uploads
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // Cloudinary cloud name
    api_key: process.env.CLOUDINARY_API_KEY,  // Cloudinary API key
    api_secret: process.env.CLOUDINARY_API_SECRET,  // Cloudinary API secret
});

// Initialize the Express application
const app = express();

// Set the port for the server to listen on, either from the environment or default to 5000
const PORT = process.env.PORT || 5000;

// Resolve the current directory path
const __dirname = path.resolve();

// Middleware setup
app.use(express.json({ limit: "5mb" }));  // Middleware to parse incoming JSON requests with a 5mb size limit
app.use(express.urlencoded({ extended: true }));  // Middleware to parse URL-encoded data from requests
app.use(cookieParser());  // Middleware to parse cookies in incoming requests

// Define the routes for different API endpoints
app.use("/api/auth", authRoutes);  // Authentication routes (login, signup, etc.)
app.use("/api/users", userRoutes);  // User-related routes (profile, follow/unfollow, etc.)
app.use("/api/posts", postRoutes);  // Post-related routes (creating posts, comments, likes, etc.)
app.use("/api/notifications", notificationRoutes);  // Notification-related routes (getting, deleting notifications)

// Serve static files in production
if (process.env.NODE_ENV === "production") {
    // Serve static files from the "frontend/dist" directory
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    // For any requests that don't match a file, send the main index.html file
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

// Start the server and connect to MongoDB
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);  // Log server startup message
    connectMongoDB();  // Connect to MongoDB database
});
