'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('babel-polyfill');

var _lfsr = require('./lfsr');

var _lfsr2 = _interopRequireDefault(_lfsr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A Galois implementation of a linear feedback shift register (LFSR). Feedback
 * taps are numbered `m..1`.
 *
 * @param {number} m - Number of taps in the register.
 * @param {number[]} [feedback_taps=[1]] - Indices of taps that affect the
 *   output (range `1..m` inclusive).
 * @param {(number|string)} [seed=1] - Starting value for the generator.
 *
 * @augments LFSR
 * @throws {TypeError}
 *
 * @example <caption>A 3-tap m-sequence (maximum-length sequence)</caption>
 *   var size = 3
 *   var lfsr = new GaloisLFSR(size, [3, 2])
 *   console.log(lfsr.current_state, lfsr.current_state.toString(2))
 *   //=> 1, "1"
 *
 *   for (var n = 1; n <= lfsr.maximum_sequence_length; n++) {
 *     var bit = lfsr.next()
 *
 *     console.log(lfsr.current_state, bit.toString(2))
 *   }
 *   //=> 6, "0"
 *   //=> 3, "1"
 *   //=> 7, "1"
 *   //=> 5, "1"
 *   //=> 4, "0"
 *   //=> 2, "0"
 *   //=> 1, "1"
 *
 * @see {FibonacciLFSR}
 * @see https://en.wikipedia.org/wiki/Linear_feedback_shift_register
 * @see http://www.newwaveinstruments.com/resources/articles/m_sequence_linear_feedback_shift_register_lfsr.htm
 */

var GaloisLFSR = function (_LFSR) {
  _inherits(GaloisLFSR, _LFSR);

  function GaloisLFSR() {
    _classCallCheck(this, GaloisLFSR);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(GaloisLFSR).apply(this, arguments));
  }

  _createClass(GaloisLFSR, [{
    key: 'next',

    /**
     * Generate the next state in the sequence.
     *
     * @returns {number} The output bit.
     *
     * @example <caption>How the next state is calculated</caption>
     *   var lfsr = new GaloisLFSR(3, [3, 1], 6)
     *   var state = lfsr.current_state // 6
     *   //=> 0b110
     *   var input = state & 1 // 0
     *   //=> 0b0
     *   state >>= 1 // 3
     *   //=> 0b011
     *   state ^= (-input) & lfsr.feedback_tap_mask
     *   // = state ^= (0b11111111111111111111111111111111 & 0b101)
     *   // = state ^= 0b110
     *   // = 3
     *   //=> 0b011
     *   state & 1 // 1
     *   //=> 0b1
     */
    value: function next() {
      var state = this.current_state;
      // Use the lowest bit in `state` as the input.
      var input = state & 1;

      // Drop the current input bit so the lowest bit of the new state serves as
      // the next input bit.
      state >>= 1;
      // JavaScript represents numbers in two's complement format: `0` and `-0`
      // are stored as `00000000`; `-1` is `11111111`. Because `input` is always
      // `0` or `1`, `-input` is a convenient way to get a bitmask to `&` against
      // when flipping bits for the next `state` value.
      //
      // @see https://en.wikipedia.org/w/index.php?title=Signed_number_representations&oldid=712932585#Two.27s_complement
      state ^= -input & this.feedback_tap_mask;
      this.current_state = state;

      return this.output_bit;
    }
  }]);

  return GaloisLFSR;
}(_lfsr2.default);

exports.default = GaloisLFSR;
//# sourceMappingURL=galois-lfsr.js.map