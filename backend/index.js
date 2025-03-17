/**
 * Travel Buddy Backend Server
 * 
 * This is the main entry point for the Travel Buddy backend server.
 * It sets up Express, connects to MongoDB, and defines API routes.
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const perplexityRoutes = require('./routes/perplexity-routes');
const fileUploadRoutes = require('./routes/file-upload-routes');
const itineraryResetRoutes = require('./routes/itinerary-reset-routes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/perplexity', perplexityRoutes);
app.use('/api/upload', fileUploadRoutes);
app.use('/api/itinerary', itineraryResetRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Travel Buddy API',
    version: '1.0.0',
  });
});

// MongoDB connection (commented out for now since we're focusing on the Perplexity API)
/*
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
*/

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});
