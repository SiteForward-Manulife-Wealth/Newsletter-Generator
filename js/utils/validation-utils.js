/**
 * Validation Utilities
 * Helper functions for input validation
 */

/**
 * Validates if string is a valid URL
 * @param {string} string - String to validate
 * @returns {boolean} True if valid URL, false otherwise
 */
function isValidURL(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

/**
 * Validates and sanitizes URL for fetch requests
 * @param {string} url - URL to validate
 * @returns {string} Validated URL
 * @throws {Error} If URL is invalid
 */
function validateFetchURL(url) {
  if (!url || typeof url !== 'string') {
    throw new Error('Invalid URL provided');
  }
  
  // Trim whitespace
  url = url.trim();
  
  // Check if valid URL
  if (!isValidURL(url)) {
    throw new Error('URL must be a valid HTTP or HTTPS address');
  }
  
  return url;
}
