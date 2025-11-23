// Helper Utilities
// General utility functions used across the application

/**
 * Generate a unique session ID
 * @returns {string} Unique session identifier
 */
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format timestamp for logging
 * @returns {string} Formatted timestamp
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Calculate interview duration
 * @param {Date} startTime - Interview start time
 * @param {Date} endTime - Interview end time
 * @returns {number} Duration in minutes
 */
function calculateDuration(startTime, endTime) {
  const diff = endTime - startTime;
  return Math.round(diff / 1000 / 60); // Convert to minutes
}

/**
 * Sanitize user input
 * @param {string} input - User input string
 * @returns {string} Sanitized string
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, 5000); // Limit to 5000 characters
}

/**
 * Validate role selection
 * @param {string} role - Selected role
 * @returns {boolean} True if valid role
 */
function isValidRole(role) {
  const validRoles = [
    'SOFTWARE_ENGINEER',
    'SALES_REPRESENTATIVE', 
    'RETAIL_ASSOCIATE',
    'PRODUCT_MANAGER',
    'DATA_ANALYST',
    'MARKETING_MANAGER'
  ];
  
  const normalizedRole = role.toUpperCase().replace(/\s+/g, '_');
  return validRoles.includes(normalizedRole);
}

/**
 * Format role name for display
 * @param {string} role - Role key
 * @returns {string} Formatted role name
 */
function formatRoleName(role) {
  return role
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Create error response
 * @param {string} message - Error message
 * @param {number} code - Error code
 * @returns {object} Error response object
 */
function createErrorResponse(message, code = 500) {
  return {
    success: false,
    error: message,
    code,
    timestamp: getTimestamp(),
  };
}

/**
 * Create success response
 * @param {object} data - Response data
 * @param {string} message - Success message
 * @returns {object} Success response object
 */
function createSuccessResponse(data, message = 'Success') {
  return {
    success: true,
    message,
    data,
    timestamp: getTimestamp(),
  };
}

module.exports = {
  generateSessionId,
  getTimestamp,
  calculateDuration,
  sanitizeInput,
  isValidRole,
  formatRoleName,
  createErrorResponse,
  createSuccessResponse,
};

