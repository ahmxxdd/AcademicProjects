// Import mongoose to interact with MongoDB
import mongoose from "mongoose";

// Define the notification schema with necessary fields and validation
const notificationSchema = new mongoose.Schema({
    from: {
        // The 'from' field references the User model and stores the ID of the user who triggered the notification
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, // Ensure 'from' field is provided
    },
    to: {
        // The 'to' field references the User model and stores the ID of the user receiving the notification
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, // Ensure 'to' field is provided
    },
    type: {
        // The 'type' field defines the type of notification, can either be 'follow' or 'like'
        type: String,
        required: true, // Ensure 'type' field is provided
        enum: ['follow', 'like'], // Limit possible values to 'follow' and 'like'
    },
    read: {
        // The 'read' field indicates whether the notification has been read
        type: Boolean,
        default: false, // Default to 'false' meaning the notification is unread initially
    }
}, {timestamps: true}); // Include timestamps for when the notification was created and last modified

// Create a model based on the notification schema
const Notification = mongoose.model("Notification", notificationSchema);

// Export the Notification model for use in other parts of the application
export default Notification;
