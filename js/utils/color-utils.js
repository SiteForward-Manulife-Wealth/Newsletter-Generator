/**
 * Color Utilities
 * Helper functions for color manipulation and analysis
 */

/**
 * Determines if a color is light or dark based on HSP color model
 * @param {string} color - Color in HEX or RGB format
 * @returns {boolean} True if color is light, false if dark
 */
function isLightColor(color) {
  // Check the format of the color, HEX or RGB?
  if (!color) return false;

  let r, g, b;
  
  if (color.match(/^rgb/)) {
    // If RGB --> store the red, green, blue values in separate variables
    const match = color.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
    );

    r = match[1];
    g = match[2];
    b = match[3];
  } else {
    // If HEX --> Convert it to RGB: http://gist.github.com/983661
    const hex = +("0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&"));

    r = hex >> 16;
    g = (hex >> 8) & 255;
    b = hex & 255;
  }

  // HSP equation from http://alienryderflex.com/hsp.html
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  // Using the HSP value, determine whether the color is light or dark
  return hsp > 127.5;
}
