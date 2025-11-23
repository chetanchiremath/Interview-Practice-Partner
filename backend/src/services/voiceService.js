// Voice Service - Voice processing (Browser-based - FREE!)
// Note: Speech-to-Text and Text-to-Speech are handled by browser APIs
// This service provides fallback and helper functions

/**
 * Validate audio file format
 * @param {string} mimetype - File mimetype
 * @returns {boolean} True if valid audio format
 */
function isValidAudioFormat(mimetype) {
  const validFormats = [
    'audio/webm',
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/m4a',
    'audio/ogg',
  ];
  
  return validFormats.includes(mimetype);
}

/**
 * Note: Speech-to-Text is now handled entirely by the browser's Web Speech API
 * This eliminates the need for external API calls and is completely FREE!
 * 
 * Browser Support:
 * - Chrome/Edge: Excellent support
 * - Firefox: Good support
 * - Safari: Good support
 */

/**
 * Note: Text-to-Speech is now handled entirely by the browser's Speech Synthesis API
 * This eliminates the need for external API calls and is completely FREE!
 * 
 * The browser provides multiple high-quality voices built-in.
 */

module.exports = {
  isValidAudioFormat,
};
