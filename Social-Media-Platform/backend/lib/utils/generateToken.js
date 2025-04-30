// Import the jwt library to generate JSON Web Tokens
import jwt from "jsonwebtoken";

// Function to generate a JWT token and set it as an HTTP-only cookie
export const generateTokenAndSetCookie = (userId, res) => {
    // Generate the JWT token using the userId, with an expiration time of 15 days
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '15d' // Token will expire in 15 days
    });

    // Set the token as a secure, HTTP-only cookie with the specified options
    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,  // Cookie will expire in 15 days
        httpOnly: true,                    // Makes the cookie inaccessible to JavaScript (security feature)
        sameSite: "strict",                // Ensures the cookie is sent only for same-site requests
        secure: process.env.NODE_ENV !== "development", // Cookie is only sent over HTTPS in non-development environments
    });
}
