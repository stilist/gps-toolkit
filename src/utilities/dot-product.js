import 'babel-polyfill'
import population_count from './population-count'

/**
 * Calculate the dot product of two binary sequences: the difference between
 * the number of matched and mismatched bits.
 *
 * > * Large positive dot product indicates strong similarity.
 * > * Large negative dot product indicates nearly all bits differ.
 * > * Dot product near 0 indicates two sequences are uncorrelated.
 * > * Dot product of n-bit sequence with itself is n.
 *
 * @param {number} sequenceA - A binary sequence (as a `Number`).
 * @param {number} sequenceB - A binary sequence (as a `Number`).
 * @param {number} [length] - The length of the sequences. Useful when the
 *   highest `1` bit is lower than the intended sequence length. (For example,
 *   passing `0b0001` and `0b0010` will give a `length` of `2`, but the
 *   intention is a `length` of `4`.) This is significant when
 *   [cross-correlating]{@link cross_correlate}
 *   [preferred sequences]{@link is_preferred_sequence}, because the
 *   inferred sequence length will naturally shift as `sequenceB` rotates.
 * @returns {number} The dot product of the sequences.
 */
function dot_product(sequenceA, sequenceB, length) {
  if (!length) {
    length = Math.max(sequenceA.toString(2).length,
                      sequenceB.toString(2).length)
  }

  const mismatches = population_count(sequenceA ^ sequenceB)
  const matches = length - mismatches

  return matches - mismatches
}
export default dot_product
