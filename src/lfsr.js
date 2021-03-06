import 'babel-polyfill'
import { bits_in_number } from './utilities/constants'
import { log_taps } from './utilities/debug'

/**
 * Filter an array to unique items.
 *
 * @param {Array} array - The array to process.
 * @returns {Array} The unique items in `array`.
 *
 * @access private
 */
function uniq(array) {
  if (typeof array.length === 'undefined') return []

  const seen = []
  const unique = []

  for (let item of array) {
    if (seen.indexOf(item) === -1) unique.push(item)
    seen.push(item)
  }

  return unique
}

/**
 * A base implementation of a linear feedback shift register (LFSR).
 *
 * @example <caption>Setting an integer seed</caption>
 *   var lfsr = new LFSR(3, [3, 2], 6)
 *   console.log(lfsr.current_state, lfsr.current_state.toString(2))
 *   //=> 6, "110"
 *
 * @example <caption>Setting a binary seed</caption>
 *   var lfsr = new LFSR(3, [3, 2], "110")
 *   console.log(lfsr.current_state, lfsr.current_state.toString(2))
 *   //=> 6, "110"
 *
 * @see https://en.wikipedia.org/wiki/Linear_feedback_shift_register
 * @see http://www.newwaveinstruments.com/resources/articles/m_sequence_linear_feedback_shift_register_lfsr.htm
 */
class LFSR {
  /**
   * @param {number} m - Number of taps in the register.
   * @param {number[]} [feedback_taps=[1]] - Indices of taps that affect the
   *   output (range `1..m` inclusive).
   * @param {(number|string)} [seed=1] - Starting value for the generator.
   *
   * @throws {RangeError}
   * @throws {TypeError}
   */
  constructor(m = 1, feedback_taps = [1], seed = 1) {
    if (typeof m !== 'number') throw new TypeError('m must be Number')

    // Make sure the entire `m` sequence can be stored in a `Number` even if
    // `feedback_taps` is configured to generate an m-sequence. (`2**53 - 1` =
    // `Number.MAX_SAFE_INTEGER`.)
    this.m = m
    if (m < 1 || m > bits_in_number) {
      throw new RangeError(`m must be in the range 1..${bits_in_number} (inclusive)`)
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
   * The current output bit.
   *
   * @type {number}
   */
  get output_bit() {
    return this.current_state & 0b1
  }

  /**
   * Generate the next state in the sequence.
   *
   * @returns {number} The output bit.
   * @throws {Error}
   *
   * @abstract
   */
  next() {
    throw new Error('`next` must be implemented by subclasses')
  }

  /**
   * LFSRs have a maximum of `2**m` states. One of those is fairly useless: if
   * seeded with all `0`s, the LFSR will never transition to any other state.
   * However, LFSR can never transition *into* that state either, so the LFSR
   * can cycle through a maximum of `2**m - 1` states.
   *
   * @type {number}
   *
   * @todo Replace with `.length`. (See {@linkcode LFSR.sequence}.)
   */
  get maximum_sequence_length() {
    if (this._maximum_sequence_length) return this._maximum_sequence_length

    const max_length = Math.pow(2, this.m) - 1

    this._maximum_sequence_length = max_length
    return max_length
  }

  /**
   * Validates the user's seed and sets a fallback value.
   *
   * @type {number}
   */
  get seed() {
    if (this._seed) return this._seed

    let bitstring = this.provided_seed

    // Coerce numbers to bitstrings to simplify length sanitization.
    if (typeof bitstring === 'number') bitstring = bitstring.toString(2)

    // Ensure the seed is at most `m` bits long.
    bitstring = bitstring.slice(-this.m)
    // Convert back to a number.
    const seed = parseInt(bitstring, 2)

    this._seed = seed
    return seed
  }

  /**
   * Validate and process feedback tap indices.
   *
   * @type {number[]}
   *
   * @access protected
   */
  get sanitized_feedback_taps() {
    if (this._sanitized_feedback_taps) return this._sanitized_feedback_taps

    const taps = this.feedback_taps
    const unique = uniq(taps)

    // Reject any indices outside the range `1..m`.
    const valid = unique.filter((tap_j) => tap_j > 0 && tap_j <= this.m)

    this._sanitized_feedback_taps = valid
    return valid
  }

  /**
   * The complete LFSR sequence.
   *
   * @type {number}
   *
   * @todo Is there a way to calculate the length of non-maximal sequences
   *   instead of watching for the state to repeat? (The current approach
   *   has to call {@linkcode LFSR#next} an extra time, which goofs up the
   *   internal state.)
   */
  get sequence() {
    if (this._sequence) return this._sequence

    const bits = [this.seed & 0b1]
    for (let i = 0; ; i++) {
      let bit = this.next()

      if (this.current_state === this.seed) break
      else bits.push(bit)
    }

    this._sequence = parseInt(bits.join(''), 2)

    return this._sequence
  }

  /**
   * Converts the list of tap indices into a corresponding bitmask.
   *
   * @type {number}
   *
   * @access private
   *
   * @example <caption>An example tap mask</caption>
   *   var lfsr = new LFSR(3, [3, 2])
   *   console.log(lfsr.feedback_tap_mask.toString(2))
   *   //=> "110"
   */
  get feedback_tap_mask() {
    if (this._feedback_tap_mask) return this._feedback_tap_mask

    const taps = this.sanitized_feedback_taps

    // `1 << tap_j - 1` makes a one followed by `tap_j - 1` zeroes; that value
    // is then ORed with `mask`, which sets bit `tap_j - 1` of `mask` to `1`.
    let mask = taps.reduce((memo, tap_j) => memo | (1 << tap_j - 1),
                           0)

    this._feedback_tap_mask = mask
    return mask
  }

  /**
   * Logs the taps and current state to help with debugging.
   *
   * @access protected
   */
  log_taps() {
    log_taps(this.sanitized_feedback_taps, this.current_state, this.m)
  }
}

export default LFSR
