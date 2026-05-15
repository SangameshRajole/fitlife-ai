// =============================================
// config/db.js — MongoDB Database Connection
// =============================================

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Try to connect to MongoDB using the URI from .env
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If successful, print the host name
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {
    // If connection fails, print the error and stop the server
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;