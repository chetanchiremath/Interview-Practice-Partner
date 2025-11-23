/**
 * Voice Routes - TypeScript Version
 * 
 * Defines all HTTP routes for voice I/O operations (STT and TTS).
 */

import { Router } from 'express';
import multer from 'multer';
import * as voiceController from '../controllers/voiceController';

const router = Router();

// Configure multer for audio file uploads (STT)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB max (Whisper limit)
  },
  fileFilter: (_req, file, cb) => {
    // Accept audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  },
});

/**
 * POST /api/voice/stt
 * Convert speech to text using OpenAI Whisper
 * Accepts multipart form data or JSON with base64 audio
 */
router.post('/stt', upload.single('audio'), voiceController.speechToText);

/**
 * POST /api/voice/tts
 * Convert text to speech using OpenAI TTS
 * Returns audio data
 */
router.post('/tts', voiceController.textToSpeech);

/**
 * POST /api/voice/tts-stream
 * Convert text to speech with streaming
 * Returns streaming audio for better UX
 */
router.post('/tts-stream', voiceController.textToSpeechStream);

/**
 * GET /api/voice/voices
 * Get available TTS voices
 */
router.get('/voices', voiceController.getAvailableVoices);

/**
 * GET /api/voice/status
 * Check voice service status
 */
router.get('/status', voiceController.getVoiceStatus);

export default router;

