// This file handles connection to MongoDB database
// It uses Mongoose library to connect to MongoDB Atlas

const mongoose = require('mongoose');

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // mongoose.connect takes the connection URI from environment variables
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Exit the process with failure code if database connection fails
    process.exit(1);
  }
};

module.exports = connectDB;
