import 'babel-polyfill'
import { bits_in_number } from './constants'
import pad_bits from './pad-bits'

/**
 * Gives a `String` with the `length` least significant bits of `number`.
 *
 * @param {number} number - The number to log.
 * @param {number} [length=53] - The number of bits to log. Defaults to the
 *   number of bits in a `Number`.
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
