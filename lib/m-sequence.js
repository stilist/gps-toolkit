'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _galoisLfsr = require('./galois-lfsr');

var _galoisLfsr2 = _interopRequireDefault(_galoisLfsr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// @see http://www.newwaveinstruments.com/resources/articles/m_sequence_linear_feedback_shift_register_lfsr.htm
var taps_lookup = [null, [1], [2, 1], [3, 2], [4, 3], [5, 3], [6, 5], [7, 6], [8, 7, 6, 1], [9, 5], [10, 7], // 10
[11, 9], [12, 11, 10, 4], [13, 12, 11, 8], [14, 13, 12, 2], [15, 14], [16, 15, 13, 4], [17, 14], [18, 11], [19, 18, 17, 14], [20, 17], // 20
[21, 19], [22, 21], [23, 18], [24, 23, 22, 17], [25, 22], [26, 25, 24, 20], [27, 26, 25, 22], [28, 25], [29, 27], [30, 29, 28, 7], // 30
[31, 28], [32, 31, 30, 10]];

/**
 * A Galois implementation of a linear feedback shift register (LFSR) that
 * places feedback taps so the LFSR will generate an m-sequence (maximal length
 * sequence).
 *
 * @class
 * @augments GaloisLFSR
 *
 * @example <caption>A 3-tap m-sequence</caption>
 *   var lfsr = new MSequence(3)
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
 * @example <caption>Setting an integer seed</caption>
 *   var lfsr = new MSequence(3, 6)
 *   var state = lfsr.next() // 3
 *   //=> 0b011
 *
 * @see https://en.wikipedia.org/wiki/Maximum_length_sequence
 * @see http://www.newwaveinstruments.com/resources/articles/m_sequence_linear_feedback_shift_register_lfsr.htm
 */

var MSequence = function (_GaloisLFSR) {
  _inherits(MSequence, _GaloisLFSR);

  /**
   * @param {number} m - Number of taps in the register.
   * @param {(number|string)} [seed] - Starting value for the generator.
   *
   * @override
   */
  function MSequence(m, seed) {
    _classCallCheck(this, MSequence);

    var taps = taps_lookup[m];

    return _possibleConstructorReturn(this, Object.getPrototypeOf(MSequence).call(this, m, taps, seed));
  }

  return MSequence;
}(_galoisLfsr2.default);

exports.default = MSequence;
//# sourceMappingURL=m-sequence.js.map