import 'babel-polyfill'

/**
 * Get the ideal cross-correlation values for a sequence of the given `length`.
 *
 * @param {number} length - The length of the sequence.
 * @returns {number[]} The values for a preferred sequence of length `length`.
 *
 * @throws {TypeError}
 *
 * @example <caption>Values for length=5</caption>
 *   preferred_sequence_values(5)
 *   //=> [-1, -9, 7]
 *
 * @see http://www.wirelesscommunication.nl/reference/chaptr05/cdma/codes/gold.htm
 */
export function preferred_sequence_values(length) {
  if (typeof length !== 'number') throw new TypeError('length must be a Number')
  if (length < 3) throw new TypeError('length must be >= 3')

  const length_adjustment = (length % 2) === 0 ? 2 : 1
  const t = Math.pow(2, (length + length_adjustment) / 2) + 1

  return [-1, -t, t - 2]
}

/**
 * Determine whether a set of correlations is a preferred sequence. (That is,
 * whether `correlations` only contains the values expected for a sequence of
 * the given length.)
 *
 * `length` is optional to save effort if you're passing in a complete
 * cross-correlation set.
 *
 * @param {number[]} correlations - The set of correlations.
 * @param {number} [length=correlations.length] - The length of the complete
 *   sequence.
 * @returns {boolean} Whether the set of correlations is limited to values from
 *   the preferred sequence.
 *
 * @throws {TypeError}
 */
export function is_preferred_sequence(correlations, length) {
  length = (length || correlations.length)

  if (typeof length !== 'number') throw new TypeError('length must be a Number')
  if (length < 1) throw new TypeError('length must be >= 1')

  const preferred_values = preferred_sequence_values(length)

  return correlations.every(value => preferred_values.includes(value))
}
