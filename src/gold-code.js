import 'babel-polyfill'

import FibonacciLFSR from './fibonacci-lfsr'

/**
 * Implements a Gold code generator.
 *
 * @example <caption>A Gold code of size 5</caption>
 *   var gold_code = new GoldCode(5, [5, 2, 3, 4], [5, 3], 0b10)
 *   gold_code.next()
 *   //=> 1
 *   gold_code.sequence
 *   //=> 0b1100011111110001000111100010100
 *   gold_code.length
 *   //=> 24
 *
 * @see https://en.wikipedia.org/wiki/Gold_code
 * @see http://pages.hmc.edu/harris/class/e11/lect7.pdf
 */
class GoldCode {
  /**
   * @param {number} m - Number of taps in the register.
   * @param {number[]} [feedback_taps_a] - Indices of taps that affect the
   *   output (range `1..m` inclusive).
   * @param {number[]} [feedback_taps_b] - Indices of taps that affect the
   *   output (range `1..m` inclusive).
   * @param {(number|string)} [seedB=1] - Starting value for the second LFSR.
   *
   * @throws {TypeError}
   */
  constructor(m, feedback_taps_a, feedback_taps_b, seedB) {
    this.size = m
    this.feedback_taps_a = feedback_taps_a
    this.feedback_taps_b = feedback_taps_b
    this.seedB = seedB
  }

  /**
   * Gold Codes are generated from a pair of {@link LFSR}s.
   *
   * @access private
   * @type {FibonacciLFSR[]}
   */
  get lfsrs() {
    if (this._lfsrs) return this._lfsrs

    const lfsrA = new FibonacciLFSR(this.size, this.feedback_taps_a, 0b1)
    const lfsrB = new FibonacciLFSR(this.size, this.feedback_taps_b, this.seedB)

    this._lfsrs = [lfsrA, lfsrB]

    return this._lfsrs
  }

  /**
   * The length of the Gold Code sequence.
   *
   * @type {number}
   */
  get length() {
    if (this._length) return this._length

    this._length = this.lfsrs[0].
      maximum_sequence_length

    return this._length
  }

  /**
   * The complete Gold Code sequence.
   *
   * @type {number}
   */
  get sequence() {
    if (this._sequence) return this._sequence

    const [lfsrA, lfsrB] = this.lfsrs
    this._sequence = lfsrA.sequence ^ lfsrB.sequence

    return this._sequence
  }

  /**
   * Generate the next state in the sequence.
   *
   * @returns {number} The output bit.
   */
  next() {
    const [lfsrA, lfsrB] = this.lfsrs

    return lfsrA.next() ^ lfsrB.next()
  }
}

export default GoldCode