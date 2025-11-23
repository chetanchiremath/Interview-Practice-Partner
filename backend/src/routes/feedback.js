// Feedback Routes
// Defines all feedback-related API endpoints

const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { validateRequiredFields } = require('../middleware/validation');

// POST /api/feedback/generate - Generate interview feedback
router.post(
  '/generate',
  validateRequiredFields(['sessionId']),
  feedbackController.generateFeedback
);

// GET /api/feedback/roles - Get available roles
router.get(
  '/roles',
  feedbackController.getAvailableRoles
);

module.exports = router;

