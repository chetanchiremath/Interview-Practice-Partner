// Validation Middleware
// Request validation and sanitization

const { createErrorResponse } = require('../utils/helpers');

/**
 * Validate request body has required fields
 * @param {Array<string>} requiredFields - Array of required field names
 */
function validateRequiredFields(requiredFields) {
  return (req, res, next) => {
    const missingFields = [];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json(
        createErrorResponse(
          `Missing required fields: ${missingFields.join(', ')}`,
          400
        )
      );
    }

    next();
  };
}

/**
 * Rate limiting middleware (simple implementation)
 * In production, use express-rate-limit or similar
 */
const requestCounts = new Map();

function simpleRateLimit(maxRequests = 100, windowMs = 60000) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const record = requestCounts.get(ip);
    
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json(
        createErrorResponse('Too many requests. Please try again later.', 429)
      );
    }

    record.count++;
    next();
  };
}

module.exports = {
  validateRequiredFields,
  simpleRateLimit,
};

