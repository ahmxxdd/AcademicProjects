import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from "cloudinary";

// Function to get a user's profile by username
export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    // Find the user by username, excluding the password field
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Return the user profile
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Function to follow or unfollow a user
export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const UserToModify = await User.findById(id); // Find the user to follow/unfollow
    const currentUser = await User.findById(req.user._id); // Find the current user

    // Check if the user is trying to follow/unfollow themselves
    if (id === req.user._id.toString()) {
      return res.status(400).json({ error: "Your can't follow/unfollow yourself" });
    }

    // Check if both users exist
    if (!UserToModify || !currentUser) {
      return res.status(400).json({ error: "User not found" });
    }

    // Check if the current user is already following the target user
    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // If already following, unfollow the user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // If not following, follow the user and create a notification
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: UserToModify._id,
      });
      await newNotification.save();

      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log("Error in followUnfollowUser: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Function to get suggested users to follow
export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id; // Get the current user's ID
    const usersFollowedByMe = await User.findById(userId).select("following"); // Get the users followed by the current user
    const users = await User.aggregate([ // Find 10 random users to suggest
      {
        $match: {
          _id: { $ne: userId }, // Exclude the current user from the suggestions
        },
      },
      { $sample: { size: 10 } },
    ]);

    // Filter out users who are already followed
    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4); // Limit to the top 4 suggested users
    suggestedUsers.forEach((user) => (user.password = null)); // Remove password field from suggested users
    res.status(200).json(suggestedUsers); // Return the suggested users
  } catch (error) {
    console.log("Error in getSuggestedUsers:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Function to update user profile details
export const updateUser = async (req, res) => {
    const {fullName, email, username, currentPassword, newPassword, bio, link} = req.body;
    let {profileImg, coverImg} = req.body;

    const userId = req.user._id; // Get the current user's ID

    try {
        let user = await User.findById(userId); // Find the user by ID
        if (!user) {
            return res.status(404).json({message: "user not found"})   
        } 
        // Validate password change: both current and new passwords must be provided
        if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({error: "Please providate both current password and new password"})
        }
        // Check if current password is correct and if new password is valid
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password); // Compare passwords
            if (!isMatch) {
                return res.status(400).json({error: "Current password is incorrect"});
            }
            if (newPassword.length < 6) {
                return res.status(400).json({error: "Password must be at least 6 characters"})
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt); // Hash the new password
        }
        // Upload and update profile image if a new one is provided
        if (profileImg) {
            if (user.profileImg) {
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]); // Remove old profile image from Cloudinary
            }
            const uploadedResponse = await cloudinary.uploader.upload(profileImg); // Upload new profile image
            profileImg = uploadedResponse.secure_url;
        }
        // Upload and update cover image if a new one is provided
        if (coverImg) {
            if (user.coverImg) {
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]); // Remove old cover image from Cloudinary
            }
            const uploadedResponse = await cloudinary.uploader.upload(coverImg); // Upload new cover image
            coverImg = uploadedResponse.secure_url;
        }

        // Update the user's profile fields with the new data (or keep the existing values)
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save(); // Save the updated user to the database

        user.password = null; // Remove password from the response

        return res.status(200).json(user); // Return the updated user profile
    } catch (error) {
        console.log("Error in updateUser", error.message);
        return res.status(500).json({error: error.message});
    }
}
