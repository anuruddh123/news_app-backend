// dbConfig.js
const mongoose = require('mongoose');
require('dotenv').config(); // local .env support

const connectDB = async () => {
  try {
    // Use production URI if available, else fallback to local
    const mongoURI = process.env.MONGO_PROD_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/news-alerts';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // exit process if DB fails
  }
};

module.exports = connectDB;