// Centralized error handling middleware
// This catches all errors thrown in controllers and sends a consistent response

// This middleware handles 404 (route not found) errors
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// This middleware handles all other errors
// Express recognizes it as error handler because it has 4 parameters
const errorHandler = (err, req, res, next) => {
  // Use the status code from the error, or default to 500 (server error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message,
    // Only show stack trace in development mode for debugging
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
