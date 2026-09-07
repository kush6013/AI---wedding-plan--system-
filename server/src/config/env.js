// This file loads environment variables from .env file
// It must be required at the very top of server.js

const dotenv = require('dotenv');

// config() reads .env file and adds variables to process.env
dotenv.config();

// Export required environment variables for easy access
module.exports = {
  MONGODB_URI: process.env.MONGODB_URI,
  // OpenRouter is an OpenAI-compatible gateway; this key lets us call any model
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  // The AI model to use on OpenRouter (e.g. openrouter/free for free models)
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || 'openrouter/free',
  PORT: process.env.PORT || 5000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};
