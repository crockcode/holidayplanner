// config/db.js
const mongoose = require("mongoose");

// Set strictQuery explicitly to suppress the warning
//mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB with URI:", 
      process.env.MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')); // Log URI with password hidden
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Additional options that might help with connection issues
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000
    });
    
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error details:", error);
    console.error("MongoDB connection error message:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
