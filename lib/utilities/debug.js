'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bits_to_string = bits_to_string;

require('babel-polyfill');

var _constants = require('./constants');

var _padBits = require('./pad-bits');

var _padBits2 = _interopRequireDefault(_padBits);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gives a `String` with the `length` least significant bits of `number`.
 *
 * @param {number} number - The number to log.
 * @param {number} [length=53] - The number of bits to log. Defaults to
 *   {@linkcode bits_in_number}.
 * @returns {string} The `length` bits of `number`.
 *
 * @throws {TypeError}
 *
 * @example <caption>With a small number</caption>
 *   bits_to_string(10, 5)
 *   //=> '01010'
 *
 * @example <caption>With a larger string</caption>
 *   bits_to_string(1023, 5)
 *   //=> '1111111111'
 */
function bits_to_string(number) {
  var length = arguments.length <= 1 || arguments[1] === undefined ? _constants.bits_in_number : arguments[1];

  if (typeof number !== 'number') throw new TypeError('number must be a Number');
  if (typeof length !== 'number') throw new TypeError('length must be a Number');

  return (0, _padBits2.default)(number.toString(2), length);
}
//# sourceMappingURL=debug.js.map