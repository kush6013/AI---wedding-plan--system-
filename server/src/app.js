// App.js - Sets up the Express application
// This file configures middleware and routes
// It does NOT start the server (that's done in server.js)

const express = require('express');
const cors = require('cors');
const { CLIENT_URL } = require('./config/env');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Import route files
const weddingRoutes = require('./routes/weddingRoutes');
const functionRoutes = require('./routes/functionRoutes');
const aiRoutes = require('./routes/aiRoutes');
const albumRoutes = require('./routes/albumRoutes');
const userRoutes = require('./routes/userRoutes');

// Create Express application
const app = express();

// =====================
// MIDDLEWARE SETUP
// =====================

// CORS - allows the frontend (React) to make requests to this backend
// Without CORS, browsers block cross-origin requests for security
app.use(
  cors({
    origin: CLIENT_URL, // Only allow requests from our frontend URL
    credentials: true, // Allow cookies/auth headers to be sent
  })
);

// Body parser - allows Express to read JSON data from request bodies
// When React sends JSON data in a POST request, this middleware parses it
app.use(express.json({ limit: '10mb' }));

// Body parser for URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));

// =====================
// ROUTES
// =====================

// Health check endpoint - used to verify the server is running
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI Wedding Planning Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount route files to their base paths
// Each router handles its own sub-routes
app.use('/api/weddings', weddingRoutes);
app.use('/api/functions', functionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/users', userRoutes);

// =====================
// ERROR HANDLING
// =====================

// Handle 404 (route not found) - if no route matched above
app.use(notFound);

// Handle all other errors - centralized error handler
app.use(errorHandler);

module.exports = app;
