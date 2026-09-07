// Server.js - Entry point of the backend application
// This file starts the server and connects to MongoDB

// Load environment variables FIRST (before any other imports)
require('./config/env');

const app = require('./app');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');

// Start the server
const startServer = async () => {
  try {
    // Connect to MongoDB before starting the server
    await connectDB();

    // Start listening for incoming requests
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
