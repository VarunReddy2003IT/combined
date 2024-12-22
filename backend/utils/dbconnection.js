const mongoose = require('mongoose');

// MongoDB connection URI (ensure sensitive data like passwords are stored securely, e.g., using environment variables)
const mongoURI = 'mongodb+srv://varunreddy2new:Varun%404545@cms.v9l9d.mongodb.net/CollegeMembers?retryWrites=true&w=majority';

/**
 * Function to establish a connection to MongoDB.
 */
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit the process with a failure code if the connection fails
  }
};

module.exports = connectDB;
