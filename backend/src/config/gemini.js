// Google Gemini Configuration
// This file sets up the Gemini client that will be used throughout the backend
// Gemini API is FREE with generous limits!

const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini client with API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the Gemini model (best for conversations)
// Using gemini-2.0-flash - latest fast and free model
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

module.exports = { genAI, model };

