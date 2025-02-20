const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const onboardingRoutes = require('./routes/onboardingRoutes');
const app = express();

// Middleware
app.use(express.json());


// Connect to MongoDB
connectDB();

// Use routes
app.use('/auth', authRoutes);
app.use('/customer', onboardingRoutes);


// Start server
app.listen(3000, () => console.log('Server running on port 3000'));