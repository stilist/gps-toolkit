import 'babel-polyfill'

import FibonacciLFSR from './fibonacci-lfsr'

/**
 * Implements a Gold code generator.
 *
 * @augments FibonacciLFSR
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
   * Gold codes are generated from a pair of {@link LFSR}s.
   *
   * @access protected
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
   * The length of the Gold code sequence.
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
   * The complete Gold code sequence.
   *
   * @type {number}
   */
  get sequence() {
    if (this._sequence) return this._sequence

    const [lfsrA, lfsrB] = this.lfsrs

    const bits = [(lfsrA.current_state & 1) ^ (lfsrB.current_state & 1)]
    while (true) {
      let bit = this.next()

      if (lfsrB.current_state === lfsrB.seed) break
      else bits.push(bit)
    }

    // @note Originally, `this._sequence` was generated with
    //   `lfsrA.sequence ^ lfsrB.sequence`. It worked well for small LFSRs
    //   (small `m`s) but returned `0` for large LFSRs because of JavaScript's
    //   floating point system. (Try `1e+26 ^ 2e+26` to see the problem.)
    this._sequence = parseInt(bits.join(''), 2)

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
