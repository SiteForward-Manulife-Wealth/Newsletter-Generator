/**
 * Notification Utilities
 * Wrapper functions for Snotify notification library
 */

/**
 * Displays error notification
 * @param {string} msg - Error message to display
 * @param {Error} er - Optional error object
 */
function sendError(msg, er) {
  if (typeof app !== 'undefined' && app.$snotify) {
    app.$snotify.error(msg);
  }
  if (er) {
    console.error(msg, er);
  }
}

/**
 * Displays success notification
 * @param {string} msg - Success message to display
 */
function sendSuccess(msg) {
  if (typeof app !== 'undefined' && app.$snotify) {
    app.$snotify.success(msg);
  }
}

/**
 * Displays info notification
 * @param {string} msg - Info message to display
 */
function sendInfo(msg) {
  if (typeof app !== 'undefined' && app.$snotify) {
    app.$snotify.info(msg);
  }
}

/**
 * Creates a delayed function (debounce)
 * @param {Function} fn - Function to delay
 * @param {number} ms - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function delay(fn, ms) {
  let timer = 0;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(fn.bind(this, ...args), ms || 0);
  };
}
