// Error Handler Middleware
// Centralized error handling for the application

const { createErrorResponse } = require('../utils/helpers');

/**
 * Global error handler middleware
 */
function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json(
      createErrorResponse('Validation error: ' + err.message, 400)
    );
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json(
      createErrorResponse('Unauthorized access', 401)
    );
  }

  // OpenAI API errors
  if (err.response && err.response.status) {
    return res.status(err.response.status).json(
      createErrorResponse('AI service error: ' + err.message, err.response.status)
    );
  }

  // Default error
  res.status(500).json(
    createErrorResponse(err.message || 'Internal server error', 500)
  );
}

/**
 * 404 Not Found handler
 */
function notFoundHandler(req, res) {
  res.status(404).json(
    createErrorResponse('Route not found', 404)
  );
}

module.exports = {
  errorHandler,
  notFoundHandler,
};

