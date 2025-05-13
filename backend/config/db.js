// ./config/db.js
const mongoose = require('mongoose');

// Set strictQuery explicitly to suppress the warning
//mongoose.set('strictQuery', true);

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('❌ MONGO_URI not found in environment variables.');
    process.exit(1);
  }

  try {
    console.log(`🔌 Attempting to connect to MongoDB...`);
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Enhanced connection options
      socketTimeoutMS: 45000,
      connectTimeoutMS: 45000,
      serverSelectionTimeoutMS: 60000,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true
    });
    
    console.log(`✅ MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    // Don't exit the process to allow for retries or graceful handling
    // process.exit(1);
  }
};

module.exports = connectDB;
