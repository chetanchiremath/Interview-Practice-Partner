/**
 * Voice Service - Speech-to-Text and Text-to-Speech
 * 
 * NOTE: Gemini doesn't have built-in STT/TTS APIs like OpenAI.
 * This service now uses browser-based APIs (Web Speech API) for free voice support.
 * 
 * For server-side STT/TTS, you can:
 * 1. Use browser Web Speech API (free, client-side)
 * 2. Use a free alternative like Google Cloud Speech-to-Text (has free tier)
 * 3. Use OpenAI Whisper/TTS (paid, but best quality)
 * 
 * Currently, voice features are handled client-side using browser APIs.
 */

import type { STTRequest, STTResponse, TTSRequest, TTSResponse } from '../types/interview.types';
import { Readable } from 'stream';

/**
 * Convert speech to text
 * 
 * NOTE: Since we're using Gemini (free), we recommend using browser Web Speech API
 * for STT. This endpoint can be used as a fallback or for server-side processing.
 * 
 * For free server-side STT, consider:
 * - Google Cloud Speech-to-Text (free tier: 60 minutes/month)
 * - AssemblyAI (free tier available)
 * - Or use browser Web Speech API (completely free, client-side)
 * 
 * @param request - STT request with audio data
 * @returns Transcribed text
 */
export async function speechToText(request: STTRequest): Promise<STTResponse> {
    const startTime = Date.now();

    try {
        console.log('[VOICE] Starting speech-to-text conversion');
        console.log('[VOICE] NOTE: For free STT, use browser Web Speech API or Google Cloud Speech-to-Text');

        // TODO: Implement free STT solution
        // Options:
        // 1. Use Google Cloud Speech-to-Text (free tier: 60 min/month)
        // 2. Use browser Web Speech API (client-side, completely free)
        // 3. Use AssemblyAI free tier

        // For now, return a placeholder
        // In production, implement one of the free options above
        throw new Error('STT not implemented. Please use browser Web Speech API or implement a free STT service.');

    } catch (error) {
        console.error('[VOICE] STT error:', error);
        throw new Error(`Speech-to-text conversion failed: ${(error as Error).message}`);
    }
}

/**
 * Convert text to speech
 * 
 * NOTE: Since we're using Gemini (free), we recommend using browser Speech Synthesis API
 * for TTS. This endpoint can be used as a fallback or for server-side processing.
 * 
 * For free server-side TTS, consider:
 * - Google Cloud Text-to-Speech (free tier: 0-4 million characters/month)
 * - Or use browser Speech Synthesis API (completely free, client-side)
 * 
 * @param request - TTS request with text to convert
 * @returns Audio buffer with speech
 */
export async function textToSpeech(request: TTSRequest): Promise<TTSResponse> {
    try {
        console.log(`[VOICE] Starting text-to-speech conversion: "${request.text.substring(0, 50)}..."`);
        console.log('[VOICE] NOTE: For free TTS, use browser Speech Synthesis API or Google Cloud TTS');

        // TODO: Implement free TTS solution
        // Options:
        // 1. Use Google Cloud Text-to-Speech (free tier: 0-4M chars/month)
        // 2. Use browser Speech Synthesis API (client-side, completely free)

        // For now, return a placeholder
        // In production, implement one of the free options above
        throw new Error('TTS not implemented. Please use browser Speech Synthesis API or implement a free TTS service.');

    } catch (error) {
        console.error('[VOICE] TTS error:', error);
        throw new Error(`Text-to-speech conversion failed: ${(error as Error).message}`);
    }
}

/**
 * Stream text to speech (for better UX with long responses)
 * 
 * NOTE: For free streaming TTS, use browser Speech Synthesis API or Google Cloud TTS
 * 
 * @param request - TTS request
 * @returns Readable stream of audio data
 */
export async function textToSpeechStream(request: TTSRequest): Promise<Readable> {
    try {
        console.log(`[VOICE] Starting streaming TTS: "${request.text.substring(0, 50)}..."`);
        console.log('[VOICE] NOTE: For free streaming TTS, use browser Speech Synthesis API');

        // TODO: Implement free streaming TTS
        throw new Error('Streaming TTS not implemented. Please use browser Speech Synthesis API.');

    } catch (error) {
        console.error('[VOICE] TTS streaming error:', error);
        throw new Error(`Text-to-speech streaming failed: ${(error as Error).message}`);
    }
}

/**
 * Estimate audio duration based on text length
 * 
 * Rough estimate: average speaking rate is about 150 words per minute
 * or about 2.5 words per second
 * 
 * @param text - Text to convert
 * @returns Estimated duration in seconds
 */
function estimateAudioDuration(text: string): number {
    const wordCount = text.split(/\s+/).length;
    const wordsPerSecond = 2.5;
    return Math.ceil(wordCount / wordsPerSecond);
}

/**
 * Validate audio format for STT
 * 
 * @param format - Audio format
 * @returns True if valid
 */
export function isValidAudioFormat(format: string): boolean {
    const validFormats = [
        'flac',
        'mp3',
        'mp4',
        'mpeg',
        'mpga',
        'm4a',
        'ogg',
        'wav',
        'webm',
    ];
    return validFormats.includes(format.toLowerCase());
}

/**
 * Validate TTS voice option
 * 
 * @param voice - Voice name
 * @returns True if valid
 */
export function isValidVoice(voice: string): boolean {
    const validVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
    return validVoices.includes(voice.toLowerCase());
}

/**
 * Get available voices with descriptions
 */
export function getAvailableVoices() {
    return [
        {
            id: 'alloy',
            name: 'Alloy',
            description: 'Neutral and balanced',
            gender: 'neutral',
        },
        {
            id: 'echo',
            name: 'Echo',
            description: 'Clear and articulate',
            gender: 'male',
        },
        {
            id: 'fable',
            name: 'Fable',
            description: 'Warm and storytelling',
            gender: 'male',
        },
        {
            id: 'onyx',
            name: 'Onyx',
            description: 'Deep and authoritative',
            gender: 'male',
        },
        {
            id: 'nova',
            name: 'Nova',
            description: 'Friendly and energetic (recommended for interviews)',
            gender: 'female',
        },
        {
            id: 'shimmer',
            name: 'Shimmer',
            description: 'Soft and gentle',
            gender: 'female',
        },
    ];
}
