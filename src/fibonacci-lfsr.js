import 'babel-polyfill'
import LFSR from './lfsr'

/**
 * A Fibonacci implementation of a linear feedback shift register (LFSR).
 *
 * @class
 *
 * @example A 3-tap m-sequence (maximum-length sequence)
 *   var size = 3
 *   var lfsr = new FibonacciLFSR(size, [3, 2])
 *   console.log(lfsr.current_state, lfsr.current_state.toString(2))
 *   //=> 1, "1"
 *
 *   var sequence_length = Math.pow(2, size) - 1
 *   for (var n = 1; n < (sequence_length + 1); n++) {
 *     var bit = lfsr.next()
 *
 *     console.log(bit, bit.toString(2))
 *   }
 *   // XXX verify below output
 *   //=> 6, "0"
 *   //=> 3, "1"
 *   //=> 7, "1"
 *   //=> 5, "1"
 *   //=> 4, "0"
 *   //=> 2, "0"
 *   //=> 1, "1"
 *
 * @see https://en.wikipedia.org/wiki/Linear_feedback_shift_register
 * @see http://www.newwaveinstruments.com/resources/articles/m_sequence_linear_feedback_shift_register_lfsr.htm
 */
class FibonacciLFSR extends LFSR {
  /**
   * Generate the next state in the sequence.
   *
   * @return {number} the output bit
   *
   * @example
   *   XXX
   */
  next() {
    let state = this.current_state

    // The input bit is the binary sum (XOR) of the feedback taps' values.
    let input_bit = 0
    let taps = this.feedback_tap_mask
    for (let state_clone = state; taps; state_clone >>= 1, taps >>= 1) {
      // Only adjust `input_bit` for active taps.
      if (!(taps & 1)) continue

      input_bit ^= state_clone & 1
    }

    // Drop previous output bit.
    state >>= 1
    // Prepend the input bit.
    //
    // @note `-1` because the input bit takes up a slot.
    state |= (input_bit << (this.m - 1))

    this.current_state = state

    return state & 1
  }
}

export default FibonacciLFSR
