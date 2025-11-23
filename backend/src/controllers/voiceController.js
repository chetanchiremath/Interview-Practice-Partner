// Voice Controller - Handles voice-related requests
// Note: Voice processing is now handled by browser APIs (FREE!)
// This controller is kept for potential future server-side voice features

const voiceService = require('../services/voiceService');
const { createSuccessResponse, createErrorResponse } = require('../utils/helpers');

/**
 * Health check for voice service
 * GET /api/voice/status
 */
function getVoiceStatus(req, res) {
  res.json(createSuccessResponse({
    status: 'available',
    mode: 'browser-based',
    message: 'Voice features are handled by browser Web Speech API',
  }));
}

module.exports = {
  getVoiceStatus,
};
