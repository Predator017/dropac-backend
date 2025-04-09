const mongoose = require('mongoose');
const dbLogger = require('../utils/logger/dbLogger');
require('dotenv').config();

// Choose the connection URI from environment variables
const dbURI = process.env.MONGO_URI;

if (!dbURI) {
  dbLogger.error('MongoDB connection URI is not defined in the environment variables.');
  console.log('MongoDB connection URI is not defined in the environment variables.');
  process.exit(1);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(dbURI, {
    });
    dbLogger.info(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    dbLogger.error(`Error connecting to MongoDB: ${error.message}`);
    console.log('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
