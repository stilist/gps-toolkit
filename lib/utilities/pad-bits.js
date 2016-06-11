'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pad_bits;

require('babel-polyfill');

/**
 * Ensure the `String` `bits` is at least `length` characters long by adding
 * `0`s to the left of the string.
 *
 * @param {string} bits - The string of bits.
 * @param {number} length - The minimum number of bits.
 * @returns {string} The adjusted string.
 *
 * @throws {TypeError}
 *
 * @example <caption>With a short string</caption>
 *   pad_bits('10', 5)
 *   //=> '00010'
 *
 * @example <caption>With a long string</caption>
 *   pad_bits('1111111111', 5)
 *   //=> '1111111111'
 */
function pad_bits(bits, length) {
  if (typeof bits !== 'string') throw new TypeError('bits must be a String');
  if (typeof length !== 'number') throw new TypeError('length must be a Number');

  if (bits.length > length) return bits;

  return '0'.repeat(length - bits.length) + bits;
}
//# sourceMappingURL=pad-bits.js.map