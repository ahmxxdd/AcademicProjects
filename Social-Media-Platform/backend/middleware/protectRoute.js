// Import the User model and jwt library
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Middleware function to protect routes by verifying JWT token
export const protectRoute = async (req, res, next) => {
    try {
        // Retrieve the token from the cookies of the request
        const token = req.cookies.jwt;

        // If no token is found, respond with an unauthorized error
        if (!token) {
            return res.status(401).json({error: "Unauthorized: no token provided"});
        }

        // Verify the token using the secret key from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // If the token is invalid or cannot be decoded, respond with an unauthorized error
        if (!decoded) {
            return res.status(401).json({error: "Unauthorized: no token provided"});
        }

        // Find the user associated with the decoded userId from the token
        const user = await User.findById(decoded.userId).select("-password");

        // If the user is not found, return a user not found error
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }

        // Attach the user to the request object to make it available in the next middleware
        req.user = user;

        // Call the next middleware function in the stack
        next();
    } catch (error) {
        // Log the error and respond with an internal server error
        console.log("Error in protectRoute middleware", error.message);
        return res.status(500).json({error: "Internal server error"});
    }
}
