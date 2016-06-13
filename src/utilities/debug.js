import 'babel-polyfill'
import { bits_in_number } from './constants'
import pad_bits from './pad-bits'

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
export function bits_to_string(number, length = bits_in_number) {
  if (typeof number !== 'number') throw new TypeError('number must be a Number')
  if (typeof length !== 'number') throw new TypeError('length must be a Number')

  return pad_bits(number.toString(2), length)
}

/**
 * Replaces character `index` of `string` with `character`.
 *
 * @param {string} string - The string to splice.
 * @param {number} index - The offset of the character to replace.
 * @param {string} character - The replacement character.
 * @returns {string} The spliced string.
 *
 * @access private
 *
 * @example
 * splice_string('abcde', 1, '-')
 * //=> 'a-cde'
 */
function splice_string(string, index, character = '') {
  return string.substr(0, index) + character +
    string.substr(index + character.length)
}

/**
 * Logs an LFSR's state and marks which tap positions are used to determine
 * the next state.
 *
 * @param {Array} taps - The tap positions to mark, ordered `m..1`.
 * @param {number} current_state - The current state of the LFSR.
 * @param {number} length - The number of bits to log.
 * @returns {string} The string that was logged.
 *
 * @throws {TypeError}
 *
 * @example
 * log_taps([5, 3, 2], 0b1, 5)
 * //=> '00001\n• •• '
 *
 * @todo Handle `length` < the high bit of `current_state` or the largest
 *   number in `taps`.
 */
export function log_taps(taps, current_state, length) {
  if (!Array.isArray(taps)) throw new TypeError('array must be an Array')
  if (!Number.isInteger(current_state)) throw new TypeError('current_state must be a Number')
  if (!Number.isInteger(length)) throw new TypeError('length must be a Number')

  length = Math.abs(length)

  const indicators = taps.reduce((memo, tap_j) => splice_string(memo, length - tap_j, '•'),
                                 ' '.repeat(length))

  const output = `${bits_to_string(current_state, length)}
${indicators}`

  console.log(output)

  return output
}
