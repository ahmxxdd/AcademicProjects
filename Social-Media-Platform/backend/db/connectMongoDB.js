// Import mongoose for MongoDB connection
import mongoose from "mongoose";

// Async function to connect to MongoDB
const connectMongoDB = async () => {
    try {
        // Attempt to connect to MongoDB using the URI from environment variables
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        // Log the successful connection message with the host details
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        // If an error occurs during the connection, log the error message
        console.error(`Error connecting to MongoDB: ${error.message}`);
        
        // Exit the process if the connection fails
        process.exit(1);
    }
}

// Export the connectMongoDB function for use in other parts of the application
export default connectMongoDB;
