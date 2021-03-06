import GaloisLFSR from './galois-lfsr'

// @see http://www.newwaveinstruments.com/resources/articles/m_sequence_linear_feedback_shift_register_lfsr.htm
const taps_lookup = [
  null,
  [1],
  [2, 1],
  [3, 2],
  [4, 3],
  [5, 3],
  [6, 5],
  [7, 6],
  [8, 7, 6, 1],
  [9, 5],
  [10, 7], // 10
  [11, 9],
  [12, 11, 10, 4],
  [13, 12, 11, 8],
  [14, 13, 12, 2],
  [15, 14],
  [16, 15, 13, 4],
  [17, 14],
  [18, 11],
  [19, 18, 17, 14],
  [20, 17], // 20
  [21, 19],
  [22, 21],
  [23, 18],
  [24, 23, 22, 17],
  [25, 22],
  [26, 25, 24, 20],
  [27, 26, 25, 22],
  [28, 25],
  [29, 27],
  [30, 29, 28, 7], // 30
  [31, 28],
  [32, 31, 30, 10]
]

/**
 * A Galois implementation of a linear feedback shift register (LFSR) that
 * places feedback taps so the LFSR will generate an m-sequence (maximal length
 * sequence).
 *
 * @class
 * @augments GaloisLFSR
 *
 * @example <caption>A 3-tap m-sequence</caption>
 *   var lfsr = new MSequence(3)
 *   console.log(lfsr.current_state, lfsr.current_state.toString(2))
 *   //=> 1, "1"
 *
 *   for (var n = 1; n <= lfsr.maximum_sequence_length; n++) {
 *     var bit = lfsr.next()
 *
 *     console.log(lfsr.current_state, bit.toString(2))
 *   }
 *   //=> 6, "0"
 *   //=> 3, "1"
 *   //=> 7, "1"
 *   //=> 5, "1"
 *   //=> 4, "0"
 *   //=> 2, "0"
 *   //=> 1, "1"
 *
 * @example <caption>Setting an integer seed</caption>
 *   var lfsr = new MSequence(3, 6)
 *   var state = lfsr.next() // 3
 *   //=> 0b011
 *
 * @see https://en.wikipedia.org/wiki/Maximum_length_sequence
 * @see http://www.newwaveinstruments.com/resources/articles/m_sequence_linear_feedback_shift_register_lfsr.htm
 */
class MSequence extends GaloisLFSR {
  /**
   * @param {number} m - Number of taps in the register.
   * @param {(number|string)} [seed] - Starting value for the generator.
   *
   * @override
   */
  constructor(m, seed) {
    const taps = taps_lookup[m]

    super(m, taps, seed)
  }
}

export default MSequence
