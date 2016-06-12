import 'babel-polyfill'
import dot_product from './dot-product'
import { rotate_array } from './rotate-sequence'

/**
 * > In signal processing, cross-correlation is a measure of similarity of two
 * > series as a function of the lag of one relative to the other.
 * >
 * > [...]
 * >
 * > In an autocorrelation, which is the cross-correlation of a signal with
 * > itself, there will always be a peak at a lag of zero, and its size will be
 * > the signal power.
 *
 * @param {number} sequenceA - The reference sequence.
 * @param {number} sequenceB - The sequence to correlate.
 * @returns {number[]} The correlation at each offset of `sequenceB`.
 *
 * @example <caption>Correlating a sequence with itself (autocorrelation)</caption>
 *   cross_correlate(0b110010, 0b110010)
 *   //=> [6, -2, -2, 2, -2, -2]
 *
 * @see https://en.wikipedia.org/wiki/Cross-correlation
 */
function cross_correlate(sequenceA, sequenceB) {
  const length = Math.max(sequenceA.toString(2).length,
                          sequenceB.toString(2).length)

  // Map `sequenceB` into an `Array` so it can be rotated.
  let bitsB = []
  // @see http://stackoverflow.com/questions/14104208/convert-integer-to-binary-and-store-it-in-an-integer-array-of-specified-sizec#comment19514125_14104263
  for (let i = 0; i < length; i++) bitsB[length - i] = (sequenceB >> i) & 0b1

  let correlations = [dot_product(sequenceA, sequenceB, length)]
  for (let offset = 1; offset < length; offset++) {
    let rotated = rotate_array(bitsB, offset)

    let sequence = parseInt(rotated.join(''), 2)
    let correlation = dot_product(sequenceA, sequence, length)

    correlations.push(correlation)
  }

  return correlations
}
export default cross_correlate
