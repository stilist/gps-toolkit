import 'babel-polyfill'
import LFSR from './lfsr'

/**
 * A Fibonacci implementation of a linear feedback shift register (LFSR).
 *
 * @class
 * @augments LFSR
 *
 * @example <caption>A 3-tap m-sequence (maximum-length sequence)</caption>
 * var size = 3
 * var lfsr = new FibonacciLFSR(size, [size, 2])
 * console.log(lfsr.current_state, lfsr.current_state.toString(2))
 * //=> 1, "1"
 *
 * for (var n = 1; n <= lfsr.maximum_sequence_length; n++) {
 *   var bit = lfsr.next()
 *
 *   console.log(bit, bit.toString(2))
 * }
 * // XXX verify below output
 * //=> 6, "0"
 * //=> 3, "1"
 * //=> 7, "1"
 * //=> 5, "1"
 * //=> 4, "0"
 * //=> 2, "0"
 * //=> 1, "1"
 *
 * @see https://en.wikipedia.org/wiki/Linear_feedback_shift_register
 * @see http://www.newwaveinstruments.com/resources/articles/m_sequence_linear_feedback_shift_register_lfsr.htm
 */
class FibonacciLFSR extends LFSR {
  /**
   * Generate the next state in the sequence.
   *
   * @returns {number} The output bit.
   * @override
   *
   * @example
   * XXX
   */
  next() {
    let state = this.current_state

    // The input bit is the binary sum (XOR) of the feedback taps' values.
    //
    // It looks odd to use just `taps` as the predicate with no comparisons,
    // but it means the loop will exit as soon as `taps` is bit shifted to be
    // all `0`s. If there are only a few taps set early in the mask this skips
    // a lot of useless iteration.
    //
    // @note This could also be implemented as:
    //     let tap_count = 0
    //     for (...) { tap_count += state_clone & 1 }
    //     input_bit ^= tap_count % 2
    //
    // @see http://graphics.stanford.edu/~seander/bithacks.html#CountBitsSetKernighan
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
