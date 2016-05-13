/**
 * A Galois implementation of a linear feedback shift register (LFSR).
 *
 * @class
 *
 * @example A 3-tap m-sequence (maximum-length sequence)
 *   var size = 3
 *   var lfsr = new LFSR(size, [3, 2])
 *   console.log(lfsr.current_state, lfsr.current_state.toString(2))
 *   //=> 1, "1"
 *
 *   // An LFSR has a maximum of 2**m - 1 valid/useful states: if the LFSR is
 *   // seeded with all zeroes the input bit can never change, so the output
 *   // will always be 0.
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
 * @example Setting an integer seed
 *   var lfsr = new LFSR(3, [3, 2], 6)
 *   var state = lfsr.next()
 *   console.log(state, state.toString(2))
 *   //=> 3, "11"
 *
 * @example Setting a binary seed
 *   var lfsr = new LFSR(3, [3, 2], "110")
 *   var state = lfsr.next()
 *   console.log(state, state.toString(2))
 *   //=> 3, "11"
 *
 * @see https://en.wikipedia.org/wiki/Linear_feedback_shift_register
 * @see http://www.newwaveinstruments.com/resources/articles/m_sequence_linear_feedback_shift_register_lfsr.htm
 */
class LFSR {
  /**
   * @param {number} m - number of taps in the register
   * @param {number[]} [feedback_taps=[1]] - indices of taps that affect the
   *   output (range 1..m inclusive)
   * @param {(number|string)} [seed=1] - starting value for the generator
   */
  constructor(m, feedback_taps, seed) {
    if (typeof m !== 'number') throw new TypeError('m must be Number')

    // Make sure the entire `m` set can be stored even if `feedback_taps` is
    // configured to generate an m-sequence.
    const m_sequence_length = Math.pow(2, m) - 1
    if (m < 1 || m_sequence_length > Number.MAX_SAFE_INTEGER) {
      const max_length = ~~(Math.sqrt(Number.MAX_SAFE_INTEGER))
      throw new TypeError(`m must be in the range 1..${max_length} (inclusive)`)
    }
    this.size = m

    if (feedback_taps && typeof feedback_taps !== 'object') {
      throw new TypeError('feedback_taps must be null or Array')
    }
    if (!feedback_taps || !feedback_taps.length) feedback_taps = [1]
    this.feedback_taps = feedback_taps
    this.feedback_tap_mask = this.getFeedbackTapMask(feedback_taps)

    if (seed && typeof seed !== 'number' && typeof seed !== 'string') {
      throw new TypeError('seed must be null, Number, or String')
    }
    this.current_state = this.getSeed(seed)
  }

  /**
   * Generate the next state in the sequence.
   *
   * @return {number} the output bit
   *
   * @example
   *   var lfsr = new LFSR(3, [3, 1], 6)
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

  /**
   * Validates the user's seed and sets a fallback value.
   *
   * @param {(number|string)} [provided_seed=1] - the seed the user set when
   *   initializing the class
   * @return {number} the validated seed value
   * @private
   *
   * @todo Convert to getter.
   */
  getSeed(provided_seed) {
    let bitstring
    let seed = 1

    if (typeof provided_seed === 'number' || typeof provided_seed === 'string') {
      // Coerce numbers to bitstrings to simplify size enforcement.
      if (typeof provided_seed === 'number') {
        bitstring = provided_seed.toString(2)
      } else {
        bitstring = provided_seed
      }

      // Ensure the seed is at most m bits long.
      bitstring = bitstring.slice(-this.size)
      // Convert back to a number.
      seed = parseInt(bitstring, 2)
    }

    return seed
  }

  /**
   * Converts the list of tap indices into a corresponding bitmask.
   *
   * @param {number[]} feedback_taps - indices to use as feedback taps
   * @return {number} bitmask of all `m` taps, with a `1` for active taps
   * @private
   *
   * @todo Detect if `feedback_taps` is sorted 1..m and invert values (m - j).
   * @todo Convert to getter.
   */
  getFeedbackTapMask(feedback_taps) {
    // Reject any indices outside the range 1..m.
    const valid = feedback_taps.filter(function (tap) {
      return tap > 0 && tap <= this.size
    }, this)

    let mask = 0
    // `1 << j - 1` makes a one followed by `j - 1` zeroes; that value is then
    // ORed with `mask`, which sets bit `j - 1` of `mask` to 1.
    //
    // @note Taps are in the range 1..m, so they need to be shifted down by one.
    //
    // @todo Could rewrite as a `.reduce`.
    for (let j of valid) mask |= (1 << j - 1)

    return mask
  }
}

export default LFSR
