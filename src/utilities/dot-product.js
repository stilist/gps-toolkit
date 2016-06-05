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
 * @returns {number} The dot product of the sequences.
 */
function dot_product(sequenceA, sequenceB) {
  const length = Math.max(sequenceA.toString(2).length,
                          sequenceB.toString(2).length)

  const mismatches = population_count(sequenceA ^ sequenceB)
  const matches = length - mismatches

  return matches - mismatches
}
export default dot_product
