/**
 * API Key Middleware
 * 
 * Extracts the Gemini API key from request headers and makes it available
 * to the agents. This allows users to provide their own API keys.
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to extract and validate API key from request
 */
export function apiKeyMiddleware(req: Request, res: Response, next: NextFunction): void {
    // Extract API key from header
    const headerKey = req.headers['x-gemini-api-key'] as string;

    // Check if we have an API key (either from header or environment)
    const apiKey = headerKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        res.status(401).json({
            success: false,
            error: {
                message: 'No Gemini API key provided. Please provide your API key in the X-Gemini-API-Key header or set GEMINI_API_KEY environment variable.',
                code: 'MISSING_API_KEY',
                statusCode: 401,
                details: {
                    howToGetKey: 'Get a free API key from https://makersuite.google.com/app/apikey',
                    headerName: 'X-Gemini-API-Key',
                },
            },
            timestamp: Date.now(),
        });
        return;
    }

    // Store the API key in the request object for use by agents
    // We'll temporarily set it in process.env for this request
    // Note: This is a simple approach. For production, consider using AsyncLocalStorage
    const originalKey = process.env.GEMINI_API_KEY;
    process.env.GEMINI_API_KEY = apiKey;

    // Restore original key after response
    res.on('finish', () => {
        if (originalKey) {
            process.env.GEMINI_API_KEY = originalKey;
        }
    });

    next();
}

/**
 * Optional middleware - only validates if header is present
 * Allows fallback to environment variable without error
 */
export function optionalApiKeyMiddleware(req: Request, res: Response, next: NextFunction): void {
    const headerKey = req.headers['x-gemini-api-key'] as string;

    if (headerKey) {
        // Temporarily override environment variable
        const originalKey = process.env.GEMINI_API_KEY;
        process.env.GEMINI_API_KEY = headerKey;

        res.on('finish', () => {
            if (originalKey) {
                process.env.GEMINI_API_KEY = originalKey;
            }
        });
    }

    next();
}
