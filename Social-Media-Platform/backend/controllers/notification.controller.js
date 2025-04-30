// Importing the Notification model
import Notification from "../models/notification.model.js";

// Controller to fetch notifications for the logged-in user
export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id; // Get the ID of the current user from the request object

        // Fetch all notifications for the user, populating the "from" field with username and profileImg
        const notifications = await Notification.find({ to: userId }).populate({
            path: "from",
            select: "username profileImg", // Select only the username and profileImg fields from the "from" user
        });

        // Mark all fetched notifications as read
        await Notification.updateMany({ to: userId }, { read: true });

        // Send the notifications as a JSON response
        res.status(200).json(notifications);
    } catch (error) {
        console.log("Error in getNotification controller:", error.message); // Log any errors
        res.status(500).json({ error: "Internal server error" }); // Send error response
    }
};

// Controller to delete all notifications for the logged-in user
export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id; // Get the ID of the current user from the request object

        // Delete all notifications for the user
        await Notification.deleteMany({ to: userId });

        // Send a success message as a JSON response
        res.status(200).json({ message: "Notifications deleted successfully" });
    } catch (error) {
        console.log("Error in deleteNotifications controller", error.message); // Log any errors
        res.status(500).json({ error: "Internal server error" }); // Send error response
    }
};
