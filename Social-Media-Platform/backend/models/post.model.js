// Import mongoose to interact with MongoDB
import mongoose from "mongoose";

// Define the post schema with necessary fields and validation
const postSchema = new mongoose.Schema(
  {
    user: {
      // The 'user' field references the User model and stores the ID of the user who created the post
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Ensure 'user' field is provided
    },
    text: {
      // The 'text' field stores the content of the post (if any)
      type: String,
    },
    img: {
      // The 'img' field stores the URL of an image attached to the post (if any)
      type: String,
    },
    likes: [
      {
        // The 'likes' field is an array of user IDs, each representing a user who liked the post
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        // Each comment has a text and a user who commented
        text: {
          // The 'text' field stores the content of the comment
          type: String,
          required: true, // Ensure 'text' field is provided for every comment
        },
        user: {
          // The 'user' field references the User model and stores the ID of the user who made the comment
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true, // Ensure 'user' field is provided for every comment
        },
      },
    ],
  },
  { timestamps: true } // Include timestamps for when the post was created and last modified
);

// Create a model based on the post schema
const Post = mongoose.model("Post", postSchema);

// Export the Post model for use in other parts of the application
export default Post;
