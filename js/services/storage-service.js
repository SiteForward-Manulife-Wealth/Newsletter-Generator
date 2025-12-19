/**
 * Storage Service
 * Handles localStorage operations with error handling
 */

/**
 * Safely gets item from localStorage
 * @param {string} key - Storage key
 * @returns {string|null} Value or null if error
 */
function safeLocalStorageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('localStorage get error:', error);
    return null;
  }
}

/**
 * Safely sets item in localStorage
 * @param {string} key - Storage key
 * @param {string} value - Value to store
 * @returns {boolean} True if successful, false otherwise
 */
function safeLocalStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error('localStorage set error:', error);
    sendError('Unable to save to browser storage. You may be in private browsing mode.');
    return false;
  }
}

/**
 * Safely removes item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} True if successful, false otherwise
 */
function safeLocalStorageRemove(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('localStorage remove error:', error);
    return false;
  }
}
