/**
 * DOM Utilities
 * Helper functions for DOM manipulation and operations
 */

/**
 * Selects all content within an element
 * @param {HTMLElement} el - The element to select
 */
function selectElementContents(el) {
  const body = document.body;
  let range, sel;
  
  if (document.createRange && window.getSelection) {
    range = document.createRange();
    sel = window.getSelection();
    sel.removeAllRanges();
    range.selectNode(el);
    sel.addRange(range);
  } else if (body.createTextRange) {
    range = body.createTextRange();
    range.moveToElementText(el);
    range.select();
  }
}

/**
 * Copies text to clipboard
 * @param {string} text - Text to copy
 * @returns {boolean} True if successful, false otherwise
 */
function copyTextToClipboard(text) {
  let textArea = document.createElement("textarea");
  textArea.style.position = "fixed";
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = "2em";
  textArea.style.height = "2em";
  textArea.style.padding = 0;
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";
  textArea.style.background = "transparent";
  textArea.value = text;

  document.body.appendChild(textArea);
  textArea.select();

  let successful;
  try {
    successful = document.execCommand("copy");
  } catch (err) {
    successful = false;
  }

  document.body.removeChild(textArea);
  return successful;
}

/**
 * Converts image element to data URL
 * @param {Object} e - Object with src property
 * @param {Function} cb - Callback function to receive data URL
 * @param {Function} progressCb - Optional progress callback
 */
function getDataUrl(e, cb, progressCb = null) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    if (progressCb) progressCb(100);
    cb(canvas.toDataURL());
  };
  
  img.onerror = () => {
    console.error('Failed to load image:', e.src);
    if (progressCb) progressCb(-1); // Indicate error
  };

  img.setAttribute("crossOrigin", "Anonymous");
  // Using AllOrigins as CORS proxy
  img.src = `https://api.allorigins.win/raw?url=${encodeURIComponent(e.src)}`;
  
  // Simulate progress for images (since we can't get actual progress from CORS proxy)
  if (progressCb) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 90) {
        clearInterval(interval);
      } else {
        progressCb(progress);
      }
    }, 100);
  }
}

/**
 * Downloads inner HTML of element as file
 * @param {string} filename - Name of file to download
 * @param {string} elId - ID of element to download
 * @param {string} mimeType - MIME type of file
 */
function downloadInnerHtml(filename, elId, mimeType = "text/plain") {
  const elHtml = document.getElementById(elId).innerHTML;
  const link = document.createElement("a");

  link.setAttribute("download", filename);
  link.setAttribute(
    "href",
    `data:${mimeType};charset=utf-8,${encodeURIComponent(elHtml)}`
  );
  link.click();
}

/**
 * Scrolls to top of element
 * @param {HTMLElement} element - Element to scroll
 */
function scrollToTop(element) {
  if (element) {
    element.scrollTop = 0;
  }
}
