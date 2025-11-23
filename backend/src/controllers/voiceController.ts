/**
 * Voice Controller - Speech-to-Text and Text-to-Speech Endpoints
 * 
 * This controller provides voice I/O capabilities using OpenAI:
 * - Speech-to-Text (Whisper): Convert user's spoken answers to text
 * - Text-to-Speech: Convert interviewer's questions to speech
 * 
 * Endpoints:
 * - POST /stt - Speech to text conversion
 * - POST /tts - Text to speech conversion (returns audio)
 * - POST /tts-stream - Text to speech streaming (for better UX)
 * - GET /voices - Get available TTS voices
 */

import { Request, Response } from 'express';
import * as voiceService from '../services/voiceService';
import type { STTRequest, TTSRequest } from '../types/interview.types';

/**
 * Convert speech to text using OpenAI Whisper
 * 
 * POST /api/voice/stt
 * Body: { audio: Buffer|base64, format?: string, language?: string }
 * 
 * @param req - Express request
 * @param res - Express response
 */
export async function speechToText(req: Request, res: Response): Promise<void> {
    try {
        // Audio can be sent as:
        // 1. Multipart form data (file upload)
        // 2. JSON with base64 encoded audio

        let audioData: Buffer | string;
        let format = 'webm';

        // Check if file was uploaded via multipart
        if (req.file) {
            audioData = req.file.buffer;
            format = req.file.mimetype.split('/')[1] || 'webm';
        }
        // Check if audio is in JSON body
        else if (req.body.audio) {
            audioData = req.body.audio;
            format = req.body.format || 'webm';
        }
        else {
            res.status(400).json({
                success: false,
                error: {
                    message: 'Audio data is required (either as file upload or base64 in JSON)',
                    code: 'MISSING_AUDIO',
                    statusCode: 400,
                },
                timestamp: Date.now(),
            });
            return;
        }

        // Validate format
        if (!voiceService.isValidAudioFormat(format)) {
            res.status(400).json({
                success: false,
                error: {
                    message: `Unsupported audio format: ${format}`,
                    code: 'INVALID_FORMAT',
                    statusCode: 400,
                },
                timestamp: Date.now(),
            });
            return;
        }

        console.log(`[VOICE] Processing STT request, format: ${format}`);

        // Convert speech to text
        const sttRequest: STTRequest = {
            audio: audioData,
            format: format as any,
            language: req.body.language || 'en',
        };

        const result = await voiceService.speechToText(sttRequest);

        // Return transcription
        res.json({
            success: true,
            data: result,
            message: 'Speech converted to text successfully',
            timestamp: Date.now(),
        });
    } catch (error) {
        console.error('[VOICE] STT error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: (error as Error).message || 'Failed to convert speech to text',
                code: 'STT_ERROR',
                statusCode: 500,
            },
            timestamp: Date.now(),
        });
    }
}

/**
 * Convert text to speech using OpenAI TTS
 * 
 * POST /api/voice/tts
 * Body: { text: string, voice?: string, speed?: number, format?: string }
 * 
 * Returns audio data
 * 
 * @param req - Express request
 * @param res - Express response
 */
export async function textToSpeech(req: Request, res: Response): Promise<void> {
    try {
        const { text, voice = 'nova', speed = 1.0, format = 'mp3' } = req.body as TTSRequest;

        // Validate input
        if (!text) {
            res.status(400).json({
                success: false,
                error: {
                    message: 'Text is required',
                    code: 'MISSING_TEXT',
                    statusCode: 400,
                },
                timestamp: Date.now(),
            });
            return;
        }

        if (text.length > 4096) {
            res.status(400).json({
                success: false,
                error: {
                    message: 'Text is too long (max 4096 characters)',
                    code: 'TEXT_TOO_LONG',
                    statusCode: 400,
                },
                timestamp: Date.now(),
            });
            return;
        }

        // Validate voice
        if (!voiceService.isValidVoice(voice)) {
            res.status(400).json({
                success: false,
                error: {
                    message: `Invalid voice: ${voice}. Use /api/voice/voices to see available voices.`,
                    code: 'INVALID_VOICE',
                    statusCode: 400,
                },
                timestamp: Date.now(),
            });
            return;
        }

        console.log(`[VOICE] Processing TTS request, voice: ${voice}, text length: ${text.length}`);

        // Convert text to speech
        const ttsRequest: TTSRequest = {
            text,
            voice: voice as any,
            speed,
            format: format as any,
        };

        const result = await voiceService.textToSpeech(ttsRequest);

        // Return audio as binary data
        res.set({
            'Content-Type': `audio/${format}`,
            'Content-Length': result.audio.length,
            'X-Audio-Duration': result.duration?.toString() || '0',
        });

        res.send(result.audio);
    } catch (error) {
        console.error('[VOICE] TTS error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: (error as Error).message || 'Failed to convert text to speech',
                code: 'TTS_ERROR',
                statusCode: 500,
            },
            timestamp: Date.now(),
        });
    }
}

/**
 * Stream text to speech (better for longer text)
 * 
 * POST /api/voice/tts-stream
 * Body: { text: string, voice?: string, speed?: number, format?: string }
 * 
 * Returns streaming audio
 * 
 * @param req - Express request
 * @param res - Express response
 */
export async function textToSpeechStream(req: Request, res: Response): Promise<void> {
    try {
        const { text, voice = 'nova', speed = 1.0, format = 'mp3' } = req.body as TTSRequest;

        // Validate input
        if (!text) {
            res.status(400).json({
                success: false,
                error: {
                    message: 'Text is required',
                    code: 'MISSING_TEXT',
                    statusCode: 400,
                },
                timestamp: Date.now(),
            });
            return;
        }

        // Validate voice
        if (!voiceService.isValidVoice(voice)) {
            res.status(400).json({
                success: false,
                error: {
                    message: `Invalid voice: ${voice}`,
                    code: 'INVALID_VOICE',
                    statusCode: 400,
                },
                timestamp: Date.now(),
            });
            return;
        }

        console.log(`[VOICE] Processing TTS stream request, voice: ${voice}`);

        // Set response headers for streaming
        res.set({
            'Content-Type': `audio/${format}`,
            'Transfer-Encoding': 'chunked',
        });

        // Get streaming audio
        const ttsRequest: TTSRequest = {
            text,
            voice: voice as any,
            speed,
            format: format as any,
        };

        const audioStream = await voiceService.textToSpeechStream(ttsRequest);

        // Pipe stream to response
        audioStream.pipe(res);

        audioStream.on('error', (error) => {
            console.error('[VOICE] TTS stream error:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    error: {
                        message: 'Streaming failed',
                        code: 'STREAM_ERROR',
                        statusCode: 500,
                    },
                    timestamp: Date.now(),
                });
            }
        });
    } catch (error) {
        console.error('[VOICE] TTS stream error:', error);
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                error: {
                    message: (error as Error).message || 'Failed to stream text to speech',
                    code: 'TTS_STREAM_ERROR',
                    statusCode: 500,
                },
                timestamp: Date.now(),
            });
        }
    }
}

/**
 * Get available TTS voices
 * 
 * GET /api/voice/voices
 * 
 * @param req - Express request
 * @param res - Express response
 */
export function getAvailableVoices(_req: Request, res: Response): void {
    const voices = voiceService.getAvailableVoices();

    res.json({
        success: true,
        data: voices,
        message: 'Available voices retrieved successfully',
        timestamp: Date.now(),
    });
}

/**
 * Voice service status check
 * 
 * GET /api/voice/status
 * 
 * @param req - Express request
 * @param res - Express response
 */
export function getVoiceStatus(_req: Request, res: Response): void {
    res.json({
        success: true,
        data: {
            status: 'available',
            mode: 'Browser-based (free)',
            note: 'Voice features use browser Web Speech API (free). Server-side STT/TTS not implemented yet.',
            sttModel: 'Browser Web Speech API',
            ttsModel: 'Browser Speech Synthesis API',
            features: ['speech-to-text (browser)', 'text-to-speech (browser)'],
            recommendation: 'Use browser APIs for free voice support',
        },
        message: 'Voice service uses browser APIs (free)',
        timestamp: Date.now(),
    });
}
