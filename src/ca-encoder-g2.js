import 'babel-polyfill'
import FibonacciLFSR from './fibonacci-lfsr'
import population_count from './utilities/population-count'

/**
 * Taken from the GPS specification, Table 3-Ia.
 *
 * @access private
 *
 * @see http://www.gps.gov/technical/icwg/IS-GPS-200H.pdf
 */
const sv_delay_taps = Object.freeze([
  null,
  [2, 6],
  [3, 7],
  [4, 8],
  [5, 9],
  [1, 9],
  [2, 10],
  [1, 8],
  [2, 9],
  [3, 10],
  [2, 3], // 10
  [3, 4],
  [5, 6],
  [6, 7],
  [7, 8],
  [8, 9],
  [9, 10],
  [1, 4],
  [2, 5],
  [3, 6],
  [4, 7], // 20
  [5, 8],
  [6, 9],
  [1, 3],
  [4, 6],
  [5, 7],
  [6, 8],
  [7, 9],
  [8, 10],
  [1, 6],
  [2, 7], // 30
  [3, 8],
  [4, 9]
])

/**
 * Generates the *G2* {@linkcode LFSR} for the [C/A-Code]{@linkcode CAEncoder}
 * (coarse acquisition code) *G<sub>i</sub>* [Gold code]. The *G2* LFSR
 * operates like a normal LFSR, but it meant to be used at a cycle delay. The
 * delay can be done two ways:
 *
 * * compute the sequence and move `n` bits from the end of the sequence to the
 *   front, or
 * * XOR the state with a second set of taps.
 *
 * [GPS specification]{@link http://www.gps.gov/technical/icwg/IS-GPS-200H.pdf}
 * (IS-GPS-200 revision H) § 3.2.1.3
 *
 * > The *G2<sub>i</sub>* sequence is a *G2* sequence selectively delayed by
 * > pre-assigned number of chips, thereby generating a set of different
 * > C/A-codes.
 *
 * § 3.3.2.1
 *
 * > The [*G2<sub>i</sub>*] sequence is selectively delayed by an integer
 * > number of chips to produce many different *G(t)* patterns (defined in
 * > Tables 3-Ia and 3-Ib).
 *
 * § 3.3.2.3
 *
 * > The *G2<sub>i</sub>* sequence is formed by effectively delaying the *G2*
 * > sequence by an integer number of chips. The *G1* and *G2* sequences are
 * > generated by 10-stage shift registers having the following polynomials as
 * > referred to in the shift register input (see Figures 3-8 and 3-9).
 * >
 * > * G1 = X<sup>10</sup> + X<sup>3</sup> + 1, and
 * > * G2 = X<sup>10</sup> + X<sup>9</sup> + X<sup>8</sup> + X<sup>6</sup> + X<sup>3</sup> + X<sup>2</sup> + 1.
 * >
 * > The initialization vector for the *G1* and *G2* sequences is `1111111111`.
 * > The *G1* and *G2* shift registers are initialized at the P-coder *X1*
 * > epoch. The *G1* and *G2* registers are clocked at 1.023 MHz derived from
 * > the 10.23 MHz P-coder clock. [...]
 * >
 * > The effective delay of the *G2* sequence to form the *G2<sub>i</sub>*
 * > sequence may be accomplished by combining the output of two stages of the
 * > *G2* shift register by modulo-2 addition (see Figure 3-10). However, this
 * > two-tap coder implementation generates only a limited set of valid C/A
 * > codes.
 *
 * @augments FibonacciLFSR
 *
 * @see http://what-when-how.com/a-software-defined-gps-and-galileo-receiver/gps-signal-gps-and-galileo-receiver-part-2/
 */
class CAEncoderG2 extends FibonacciLFSR {
  /**
   * @param {number} sv - The SV ID.
   *
   * @throws {TypeError}
   */
  constructor(sv) {
    super(10, [10, 2, 3, 6, 8, 9], 0b1111111111)

    if (!Number.isInteger(sv)) throw new TypeError('sv must be a number')
    if (sv < 1 || sv > 32) throw new TypeError('sv must be in the range 1..32 (inclusive)')
    this.sv = sv
  }

  /**
   * The delay taps as a bitmask.
   *
   * @access private
   * @type {number}
   */
  get delay_taps() {
    if (this._delay_taps) return this._delay_taps

    const taps = sv_delay_taps[this.sv]

    // `1 << tap_j - 1` makes a one followed by `tap_j - 1` zeroes; that value
    // is then ORed with `mask`, which sets bit `tap_j - 1` of `mask` to `1`.
    this._delay_taps = taps.map((tap_j) => this.m - tap_j).
                            reduce((memo, tap_j) => memo | (1 << tap_j),
                                   0)

    return this._delay_taps
  }

  /**
   * Calculate the delayed output bit using {@link CAEncoderG2.delay_taps}.
   *
   * @type {number}
   */
  get output_bit() {
    const active_delay_bits = this.current_state & this.delay_taps
    const active_delay_bit_count = population_count(active_delay_bits)

    return active_delay_bit_count % 2
  }

  /**
   * @inheritdoc
   */
  get sequence() {
    if (this._sequence) return this._sequence

    const bits = [this.output_bit]
    while (true) {
      let bit = this.next()

      if (this.current_state === this.seed) break
      else bits.push(bit)
    }

    this._sequence = parseInt(bits.join(''), 2)

    return this._sequence
  }
}
export default CAEncoderG2
