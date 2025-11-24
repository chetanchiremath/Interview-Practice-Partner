/**
 * Gemini Client Factory
 * 
 * Creates Gemini clients dynamically using API keys from request headers.
 * This allows users to provide their own API keys instead of using a shared one.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { Request } from 'express';

/**
 * Get Gemini API key from request header or environment variable
 */
export function getApiKey(req: Request): string {
    // First, try to get from request header (user-provided key)
    const headerKey = req.headers['x-gemini-api-key'] as string;

    if (headerKey) {
        return headerKey;
    }

    // Fallback to environment variable (for development or self-hosted)
    const envKey = process.env.GEMINI_API_KEY;

    if (envKey) {
        return envKey;
    }

    throw new Error('No Gemini API key provided. Please set X-Gemini-API-Key header or GEMINI_API_KEY environment variable.');
}

/**
 * Create a Gemini client for the request
 */
export function createGeminiClient(req: Request): GoogleGenerativeAI {
    const apiKey = getApiKey(req);
    return new GoogleGenerativeAI(apiKey);
}

/**
 * Get Gemini model for conversational tasks
 */
export function getGeminiModel(req: Request) {
    const genAI = createGeminiClient(req);
    return genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
        },
    });
}

/**
 * Get Gemini model for analytical tasks (lower temperature)
 */
export function getGeminiModelStrict(req: Request) {
    const genAI = createGeminiClient(req);
    return genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
            temperature: 0.3,
            topP: 0.8,
            topK: 40,
        },
    });
}
