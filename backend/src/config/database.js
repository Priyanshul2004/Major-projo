const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB connection string - replace with your actual connection string
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-class-axis';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
