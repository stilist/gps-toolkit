import 'babel-polyfill'
import FibonacciLFSR from './fibonacci-lfsr'

/**
* Generates the *G1* {@linkcode LFSR} for the [C/A-Code]{@linkcode CAEncoder}
* (coarse acquisition code) *G<sub>i</sub>* [Gold code]. The *G1* LFSR
* operates like a normal LFSR, but its output is the value of tap 10, rather
* than the standard binary sum of all active taps.
*
* [GPS specification]{@link http://www.gps.gov/technical/icwg/IS-GPS-200H.pdf}
* (IS-GPS-200 revision H) § 3.3.2.3
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
*
* @augments FibonacciLFSR
*
* @see http://what-when-how.com/a-software-defined-gps-and-galileo-receiver/gps-signal-gps-and-galileo-receiver-part-2/
 */
class CAEncoderG1 extends FibonacciLFSR {
  /**
   * @throws {TypeError}
   */
  constructor() {
    super(10, [10, 3], 0b1111111111)
  }

  /**
   * Calculate the output bit using tap 10.
   *
   * @type {number}
   */
  get output_bit() {
    return this.current_state & 0b0000000001
  }
}
export default CAEncoderG1
