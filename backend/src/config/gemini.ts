/**
 * Google Gemini Configuration
 * 
 * This file sets up the Gemini client for the multi-agent system.
 * Gemini API is FREE with generous limits - perfect for this project!
 * 
 * Get your API key from: https://makersuite.google.com/app/apikey
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client with API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Get the Gemini model (best for conversations)
// Using gemini-2.0-flash - latest fast and free model
// Alternative: gemini-1.5-pro (more capable but slower)
export const geminiModel = genAI.getGenerativeModel({ 
  model: 'gemini-2.5-flash',
  // You can configure generation settings here
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
  },
});

// For more consistent/analytical tasks (Analyzer, Orchestrator)
export const geminiModelStrict = genAI.getGenerativeModel({ 
  model: 'gemini-2.5-flash',
  generationConfig: {
    temperature: 0.3, // Lower temperature for more consistent outputs
    topP: 0.8,
    topK: 40,
  },
});

export { genAI };

