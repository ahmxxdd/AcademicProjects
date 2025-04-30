// Import mongoose to interact with MongoDB
import mongoose from "mongoose";

// Define the user schema with necessary fields and validation
const userSchema = new mongoose.Schema(
  {
    username: {
      // The 'username' field stores the unique username of the user
      type: String,
      required: true,  // Ensure 'username' field is provided
      unique: true,    // 'username' must be unique
    },
    fullName: {
      // The 'fullName' field stores the full name of the user
      type: String,
      required: true,  // Ensure 'fullName' field is provided
    },
    password: {
      // The 'password' field stores the hashed password of the user
      type: String,
      required: true,  // Ensure 'password' field is provided
      minLength: 6,    // Password must be at least 6 characters long
    },
    email: {
      // The 'email' field stores the user's email
      type: String,
      required: true,  // Ensure 'email' field is provided
      unique: true,    // 'email' must be unique
    },
    followers: [
      {
        // The 'followers' field stores an array of user IDs representing the users following this user
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Reference to the User model
        default: [],   // Default is an empty array if no followers
      },
    ],
    following: [
      {
        // The 'following' field stores an array of user IDs representing the users this user is following
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Reference to the User model
        default: [],   // Default is an empty array if not following anyone
      },
    ],

    profileImg: {
      // The 'profileImg' field stores the URL of the user's profile image
      type: String,
      default: "",  // Default is an empty string if no profile image
    },
    coverImg: {
      // The 'coverImg' field stores the URL of the user's cover image
      type: String,
      default: "",  // Default is an empty string if no cover image
    },
    bio: {
      // The 'bio' field stores a brief description of the user
      type: String,
      default: "",  // Default is an empty string if no bio
    },
    link: {
      // The 'link' field stores a URL link associated with the user (e.g., personal website, social media)
      type: String,
      default: "",  // Default is an empty string if no link is provided
    },
    likedPosts: [
      {
        // The 'likedPosts' field stores an array of post IDs representing the posts this user has liked
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",  // Reference to the Post model
        default: [],   // Default is an empty array if no posts are liked
      },
    ],
  },
  { timestamps: true } // Include timestamps for when the user was created and last modified
);

// Create a model based on the user schema
const User = mongoose.model("User", userSchema);

// Export the User model for use in other parts of the application
export default User;
