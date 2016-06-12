'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rotate_array = rotate_array;
exports.rotate_number_bits = rotate_number_bits;

require('babel-polyfill');

var _constants = require('./constants');

var _padBits = require('./pad-bits');

var _padBits2 = _interopRequireDefault(_padBits);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Rotate `distance` elements to the head of `array`.
 *
 * @param {number[]} array - The array to rotate.
 * @param {number} [distance=1] - How many elements to move to the head.
 * @returns {Array} The rotated array.
 *
 * @throws {TypeError}
 *
 * @example <caption>Rotating with default length</caption>
 *   rotate_array([1, 2, 3])
 *   //=> [3, 1, 2]
 *
 * @todo Handle `distance > array.length`.
 */
function rotate_array(array) {
  var distance = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

  if (!Array.isArray(array)) throw new TypeError('array must be an Array');
  if (typeof distance !== 'number') throw new TypeError('distance must be a Number');

  distance = Math.abs(distance);

  if (!array.length) return array;

  var head = array.slice(0, -distance);
  var tail = array.slice(array.length - distance);

  return tail.concat(head);
}

/**
 * Rotate `distance` bits of a `Number` to the head of `bits`.
 *
 * @param {number} bits - The bits of this number will be rotated.
 * @param {number} [distance=1] - How many bits to move to the head.
 * @param {number} [bits_length=53] - The intended length of the bit sequence.
 *   Defaults to {@linkcode bits_in_number}.
 * @returns {number} The rotated `bits`. The return type matches the
 *   input type.
 *
 * @throws {TypeError}
 *
 * @example <caption>With default distance and bits_length</caption>
 *   rotate_number_bits(0b1)
 *   //=> parseInt('10000000000000000000000000000000000000000000000000000', 2)
 *
 * @todo Handle `distance > bits_length`.
 */
function rotate_number_bits(bits) {
  var distance = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
  var bits_length = arguments.length <= 2 || arguments[2] === undefined ? _constants.bits_in_number : arguments[2];

  if (typeof bits !== 'number') throw new TypeError('bits must be a Number');
  if (typeof distance !== 'number') throw new TypeError('distance must be a Number');
  if (typeof bits_length !== 'number') throw new TypeError('bits_length must be a Number');

  distance = Math.abs(distance);

  /**
   * (0).toString()
   * //=> '0'
   */
  if (bits === 0) return bits;

  var bits_string = bits.toString(2);
  var array = (0, _padBits2.default)(bits_string, bits_length).split('');
  var rotated = rotate_array(array, distance).join('');

  return parseInt(rotated, 2);
}
//# sourceMappingURL=rotate-sequence.js.map