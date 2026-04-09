const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    if (process.env.NODE_ENV === 'production' && !process.env.MONGO_PROD_URI) {
      console.error('❌ MONGO_PROD_URI not set in production!');
      process.exit(1);
    }

    const mongoURI =
      process.env.NODE_ENV === 'production'
        ? process.env.MONGO_PROD_URI
        : process.env.MONGO_URI || 'mongodb://localhost:27017/news-alerts';

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;