// Interview Routes
// Defines all interview-related API endpoints

const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const { validateRequiredFields } = require('../middleware/validation');

// POST /api/interview/start - Start new interview
router.post(
  '/start',
  validateRequiredFields(['role']),
  interviewController.startInterview
);

// POST /api/interview/respond - Send user response
router.post(
  '/respond',
  validateRequiredFields(['sessionId', 'message']),
  interviewController.sendResponse
);

// GET /api/interview/session/:sessionId - Get session data
router.get(
  '/session/:sessionId',
  interviewController.getSession
);

// POST /api/interview/end - End interview
router.post(
  '/end',
  validateRequiredFields(['sessionId']),
  interviewController.endInterview
);

module.exports = router;

