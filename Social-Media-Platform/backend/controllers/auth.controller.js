// Importing required modules and dependencies
import User from "./../models/user.model.js"; // User model
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js"; // Utility function to generate token and set cookie
import bcrypt from "bcryptjs"; // Library for password hashing and comparison

// Controller for user signup
export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body; // Extracting user input from request body

    // Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    // Validate password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    // Hash the password before saving to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    // Save user to database and generate a token if successful
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res); // Generate and set token as cookie
      await newUser.save();

      // Return user data (excluding password) in response
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller for user login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body; // Extracting credentials from request body

    // Find user by username
    const user = await User.findOne({ username });

    // Compare provided password with hashed password in database
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    // If user not found or password doesn't match, return error
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Generate and set token as cookie
    generateTokenAndSetCookie(user._id, res);

    // Return user data (excluding password) in response
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller for user logout
export const logout = async (req, res) => {
  try {
    // Clear the JWT cookie
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller");
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to get the current user's profile (excluding password)
export const getMe = async (req, res) => {
  try {
    // Find user by ID stored in req.user and exclude password
    const user = await User.findById(req.user._id).select("-password");

    // Return user data
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getMe controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
