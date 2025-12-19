/**
 * Array Utilities
 * Helper functions for array manipulation
 */

/**
 * Moves an item in an array from one position to another
 * @param {Array} array - The array to modify
 * @param {number} from - Index to move from
 * @param {number} to - Index to move to
 * @returns {Array} The modified array
 */
function moveItem(array, from, to) {
  const item = array.splice(from, 1)[0];
  array.splice(to, 0, item);
  return array;
}

/**
 * Adds splice functionality to String prototype if not available
 */
if (!String.prototype.splice) {
  String.prototype.splice = function (start, delCount, newSubStr) {
    return (
      this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount))
    );
  };
}
