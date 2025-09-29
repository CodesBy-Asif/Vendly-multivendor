const mongoose = require("mongoose");
require("dotenv").config();

const connectDatabase = async () => {
    console.log(process.env.DB_URI)
  try {
  
    const data = await mongoose.connect(process.env.DB_URI);
    console.log(`MongoDB connected with server: ${data.connection.host}`);
  } catch (err) {
    console.error(" MongoDB connection failed:", err.message);
    process.exit(1); // Stop the app if DB fails
  }
};

module.exports = connectDatabase;