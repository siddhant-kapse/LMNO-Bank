require('dotenv').config(); // Load environment variables

const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI; // Get the URI from .env

if (!mongoURI) {
  console.error("MONGODB_URI environment variable is not set.");
  process.exit(1); // Exit the application if the URI is missing
}

const connectDB = () => {
  mongoose.connect(mongoURI) // Removed useNewUrlParser and useUnifiedTopology
    .then(() => console.log('Connected to MongoDB-2'))
    .catch(err => console.error('Error connecting to MongoDB:', err.message));
};


module.exports = connectDB;
