/**
 * A base implementation of a linear feedback shift register (LFSR).
 *
 * @class
 *
 * @example Setting an integer seed
 *   var lfsr = new LFSR(3, [3, 2], 6)
 *   console.log(lfsr.current_state, lfsr.current_state.toString(2))
 *   //=> 6, "110"
 *
 * @example Setting a binary seed
 *   var lfsr = new LFSR(3, [3, 2], "110")
 *   console.log(lfsr.current_state, lfsr.current_state.toString(2))
 *   //=> 6, "110"
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
  constructor(m=1, feedback_taps=[1], seed=1) {
    if (typeof m !== 'number') throw new TypeError('m must be Number')

    // Make sure the entire `m` sequence can be stored in a `Number` even if
    // `feedback_taps` is configured to generate an m-sequence.
    this.m = m
    if (m < 1 || this.maximum_sequence_length > Number.MAX_SAFE_INTEGER) {
      const max_m = ~~(Math.sqrt(Number.MAX_SAFE_INTEGER))
      throw new TypeError(`m must be in the range 1..${max_m} (inclusive)`)
    }

    if (typeof feedback_taps.length === 'undefined') {
      throw new TypeError('feedback_taps must be null or Array')
    }
    // Handle empty array.
    if (!feedback_taps.length) feedback_taps = [1]
    this.feedback_taps = feedback_taps

    if (seed && typeof seed !== 'number' && typeof seed !== 'string') {
      throw new TypeError('seed must be null, Number, or String')
    }
    this.provided_seed = seed
    this.current_state = this.seed
  }

  /**
   * @private
   */
  next() {
    throw new Error('`next` must be implemented by subclasses')
  }

  /**
   * LFSRs have a maximum of `2**m` states. One of those is fairly useless: if
   * seeded with all `0`s, the LFSR will never transition to any other state.
   * However, LFSR can never transition *into* that state, so the maximum
   * sequence length is `2**m - 1`.
   *
   * @return {number} the largest possible number of states for the given `m`
   */
  get maximum_sequence_length() {
    // const max_length = Math.pow(2, this.m) - 1
    // delete this.maximum_sequence_length
    // return this.maximum_sequence_length = max_length
    return Math.pow(2, this.m) - 1
  }

  /**
   * Validates the user's seed and sets a fallback value.
   *
   * @return {number} the validated seed value
   */
  get seed() {
    let bitstring = this.provided_seed

    // Coerce numbers to bitstrings to simplify length sanitization.
    if (typeof bitstring === 'number') bitstring = bitstring.toString(2)

    // Ensure the seed is at most `m` bits long.
    bitstring = bitstring.slice(-this.m)
    // Convert back to a number.
    const seed = parseInt(bitstring, 2)

    // delete this.seed
    // return this.seed = seed
    return seed
  }

  /**
   * Converts the list of tap indices into a corresponding bitmask.
   *
   * @param {number[]} feedback_taps - indices to use as feedback taps
   * @return {number} bitmask of all `m` taps, with a `1` for active taps
   * @private
   *
   * @todo XXX Need to handle Fibonacci vs Galois taps.
   */
  get feedback_tap_mask() {
    const taps = this.feedback_taps

    // Reject any indices outside the range 1..m.
    const valid = taps.filter((tap) => tap > 0 && tap <= this.m)

    // `1 << j - 1` makes a one followed by `j - 1` zeroes; that value is then
    // ORed with `mask`, which sets bit `j - 1` of `mask` to 1.
    //
    // @note Taps are in the range 1..m, so `j` must be shifted reduced by one.
    let mask = valid.reduce((memo, j) => memo | (1 << j - 1),
                            0)

    // delete this.mask
    // return this.mask = mask
    return mask
  }
}

export default LFSR
