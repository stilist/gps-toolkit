import 'babel-polyfill'
import LFSR from './lfsr'

/**
 * A Galois implementation of a linear feedback shift register (LFSR).
 *
 * @class
 *
 * @example A 3-tap m-sequence (maximum-length sequence)
 *   var size = 3
 *   var lfsr = new GaloisLFSR(size, [3, 2])
 *   console.log(lfsr.current_state, lfsr.current_state.toString(2))
 *   //=> 1, "1"
 *
 *   var sequence_length = Math.pow(2, size) - 1
 *   for (var n = 1; n < (sequence_length + 1); n++) {
 *     var bit = lfsr.next()
 *
 *     console.log(bit, bit.toString(2))
 *   }
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
class GaloisLFSR extends LFSR {
  /**
   * Generate the next state in the sequence.
   *
   * @return {number} the output bit
   *
   * @example
   *   var lfsr = new GaloisLFSR(3, [3, 1], 6)
   *   lfsr.current_state
   *   //=> 0b110 (6)
   *   lfsr.feedback_tap_mask
   *   //=> 0b101
   *   input = state & 1
   *   // input = 0b0
   *   //=> 0b0 (0)
   *   state >>= 1
   *   //=> 0b011 (3)
   *   state ^= (-input) & this.feedback_tap_mask
   *   // state ^= (0b11111111111111111111111111111111 & 0b101)
   *   // state ^= 0b110
   *   //=> 0b011 (3)
   *   state & 1
   *   //=> 0b1 (1)
   */
  next() {
    let state = this.current_state
    // Use the lowest bit in `state` as the input.
    const input = state & 1

    // Drop the current input bit so the lowest bit of the new state serves as the
    // next input bit.
    state >>= 1
    // JavaScript represents numbers in two's complement format: `0` and `-0`
    // are stored as `00000000`; `-1` is `11111111`. Because `input` is always
    // `0` or `1`, `-input` is a convenient way to get a bitmask to `&` against
    // when flipping bits for the next `state` value.
    //
    // @see https://en.wikipedia.org/w/index.php?title=Signed_number_representations&oldid=712932585#Two.27s_complement
    state ^= (-input) & this.feedback_tap_mask
    this.current_state = state

    return state & 1
  }
}

export default GaloisLFSR
