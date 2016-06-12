import 'babel-polyfill'
import { bits_in_number } from './constants'
import pad_bits from './pad-bits'

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
export function rotate_array(array, distance = 1) {
  if (!Array.isArray(array)) throw new TypeError('array must be an Array')
  if (typeof distance !== 'number') throw new TypeError('distance must be a Number')

  distance = Math.abs(distance)

  if (!array.length) return array

  const head = array.slice(0, -distance)
  const tail = array.slice(array.length - distance)

  return tail.concat(head)
}

/**
 * Rotate `distance` bits of a `Number` to the head of `bits`.
 *
 * @param {number} bits - The bits of this number will be rotated.
 * @param {number} [distance=1] - How many bits to move to the head.
 * @param {number} [bits_length=53] - The intended length of the bit sequence.
 *   Defaults to the number of bits in a `Number`.
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
export function rotate_number_bits(bits, distance = 1, bits_length = bits_in_number) {
  if (typeof bits !== 'number') throw new TypeError('bits must be a Number')
  if (typeof distance !== 'number') throw new TypeError('distance must be a Number')
  if (typeof bits_length !== 'number') throw new TypeError('bits_length must be a Number')

  distance = Math.abs(distance)

  /**
   * (0).toString()
   * //=> '0'
   */
  if (bits === 0) return bits

  const bits_string = bits.toString(2)
  let array = pad_bits(bits_string, bits_length).split('')
  let rotated = rotate_array(array, distance).join('')

  return parseInt(rotated, 2)
}
