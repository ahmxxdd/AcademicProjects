// Importing required models and cloudinary configuration
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

// Controller to create a new post
export const createPost = async (req, res) => {
	try {
		const { text } = req.body; // Extracting the text field from the request body
		let { img } = req.body; // Extracting the image (if any) from the request body
		const userId = req.user._id.toString(); // Getting the user ID from the request object

		// Verifying if the user exists
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		// Ensuring the post has at least text or an image/video
		if (!text && !img) {
			return res.status(400).json({ error: "Post must have text or image/video" });
		}

		// If an image/video is included, upload it to Cloudinary
		if (img) {
			const fileType = img.split(";")[0].split(":")[1]; // Extract MIME type
			if (!fileType.startsWith("image/") && !fileType.startsWith("video/")) {
				return res.status(400).json({ error: "Unsupported file type" });
			}

			const uploadedResponse = await cloudinary.uploader.upload(img, {
				resource_type: "auto", // Automatically handles images/videos
			});
			img = uploadedResponse.secure_url; // Update img to the secure URL from Cloudinary
		}

		// Create a new Post document
		const newPost = new Post({
			user: userId,
			text,
			img,
		});

		// Save the post to the database
		await newPost.save();
		res.status(201).json(newPost); // Respond with the created post
	} catch (error) {
		console.error("Error in createPost controller: ", error.response || error.message || error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Controller to delete a post
export const deletePost = async (req, res) => {
	try {
		// Find the post by its ID
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		// Ensure the user deleting the post is the owner
		if (post.user.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "You are not authorized to delete this post" });
		}

		// If the post contains an image, delete it from Cloudinary
		if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0]; // Extract the image ID from the URL
			await cloudinary.uploader.destroy(imgId); // Delete the image from Cloudinary
		}

		// Delete the post from the database
		await Post.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		console.log("Error in deletePost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Controller to add a comment to a post
export const commentOnPost = async (req, res) => {
	try {
		const { text } = req.body; // Extract the comment text from the request body
		const postId = req.params.id; // Get the post ID from the request parameters
		const userId = req.user._id; // Get the user ID from the request object

		// Ensure the comment has text
		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}

		// Find the post being commented on
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		// Create a new comment object
		const comment = { user: userId, text };

		// Add the comment to the post and save
		post.comments.push(comment);
		await post.save();

		res.status(200).json(post); // Respond with the updated post
	} catch (error) {
		console.log("Error in commentOnPost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Controller to like or unlike a post
export const likeUnlikePost = async (req, res) => {
	try {
		const userId = req.user._id; // Get the user ID from the request object
		const { id: postId } = req.params; // Get the post ID from the request parameters

		// Find the post being liked/unliked
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId); // Check if the user has already liked the post

		if (userLikedPost) {
			// Unlike the post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

			const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
			res.status(200).json(updatedLikes); // Respond with the updated likes array
		} else {
			// Like the post
			post.likes.push(userId);
			await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
			await post.save();

			// Create a notification for the like action
			const notification = new Notification({
				from: userId,
				to: post.user,
				type: "like",
			});
			await notification.save();

			const updatedLikes = post.likes; // Updated likes array
			res.status(200).json(updatedLikes); // Respond with the updated likes array
		}
	} catch (error) {
		console.log("Error in likeUnlikePost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Controller to fetch all posts
export const getAllPosts = async (req, res) => {
	try {
		// Retrieve all posts, sorted by creation date, and populate user and comment data
		const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password", // Exclude password from user data
			})
			.populate({
				path: "comments.user",
				select: "-password", // Exclude password from commenter data
			});

		if (posts.length === 0) {
			return res.status(200).json([]); // Return an empty array if no posts exist
		}

		res.status(200).json(posts); // Respond with all posts
	} catch (error) {
		console.log("Error in getAllPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Controller to fetch liked posts for a user
export const getLikedPosts = async (req, res) => {
	const userId = req.params.id; // Get the user ID from the request parameters

	try {
		// Find the user by their ID
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		// Find posts liked by the user
		const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(likedPosts); // Respond with the liked posts
	} catch (error) {
		console.log("Error in getLikedPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Controller to fetch posts from users followed by the logged-in user
export const getFollowingPosts = async (req, res) => {
	try {
		const userId = req.user._id; // Get the logged-in user's ID
		const user = await User.findById(userId); // Find the user
		if (!user) return res.status(404).json({ error: "User not found" });

		const following = user.following; // Get the list of followed users

		// Find posts from followed users
		const feedPosts = await Post.find({ user: { $in: following } })
			.sort({ createdAt: -1 }) // Sort posts by creation date
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(feedPosts); // Respond with the posts
	} catch (error) {
		console.log("Error in getFollowingPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Controller to fetch posts from a specific user
export const getUserPosts = async (req, res) => {
	try {
		const { username } = req.params; // Extract the username from the request parameters

		// Find the user by their username
		const user = await User.findOne({ username });
		if (!user) return res.status(404).json({ error: "User not found" });

		// Find posts created by the user
		const posts = await Post.find({ user: user._id })
			.sort({ createdAt: -1 }) // Sort posts by creation date
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(posts); // Respond with the user's posts
	} catch (error) {
		console.log("Error in getUserPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
