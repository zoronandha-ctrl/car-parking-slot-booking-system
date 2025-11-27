const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Try to load Firebase config, fallback to .env
    let mongoUri = process.env.MONGODB_URI;
    try {
      const firebaseConfig = require('./firebase-env');
      if (firebaseConfig.MONGODB_URI) {
        mongoUri = firebaseConfig.MONGODB_URI;
      }
    } catch (e) {
      // Use .env if firebase-env not available
    }
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
