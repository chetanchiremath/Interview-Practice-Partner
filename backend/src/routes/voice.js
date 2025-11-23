// Voice Routes
// Voice processing is now handled by browser APIs (FREE!)

const express = require('express');
const router = express.Router();
const voiceController = require('../controllers/voiceController');

// GET /api/voice/status - Check voice service status
router.get('/status', voiceController.getVoiceStatus);

module.exports = router;
