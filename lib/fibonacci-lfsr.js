'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

require('babel-polyfill');

var _lfsr = require('./lfsr');

var _lfsr2 = _interopRequireDefault(_lfsr);

var _populationCount = require('./utilities/population-count');

var _populationCount2 = _interopRequireDefault(_populationCount);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A Fibonacci implementation of a linear feedback shift register (LFSR).
 * Feedback taps are ordered `1..m`.
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
 *   var lfsr = new FibonacciLFSR(size, [size, 2])
 *   console.log(lfsr.current_state, lfsr.current_state.toString(2))
 *   //=> 1, "1"
 *
 *   for (var n = 1; n <= lfsr.maximum_sequence_length; n++) {
 *     var bit = lfsr.next()
 *
 *     console.log(lfsr.current_state, bit.toString(2))
 *   }
 *   //=> 4, "0"
 *   //=> 2, "0"
 *   //=> 5, "1"
 *   //=> 6, "0"
 *   //=> 7, "1"
 *   //=> 3, "1"
 *   //=> 1, "1"
 *
 * @see {GaloisLFSR}
 * @see https://en.wikipedia.org/wiki/Linear_feedback_shift_register
 * @see http://www.newwaveinstruments.com/resources/articles/m_sequence_linear_feedback_shift_register_lfsr.htm
 */
var FibonacciLFSR = function (_LFSR) {
  _inherits(FibonacciLFSR, _LFSR);

  function FibonacciLFSR() {
    _classCallCheck(this, FibonacciLFSR);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(FibonacciLFSR).apply(this, arguments));
  }

  _createClass(FibonacciLFSR, [{
    key: 'next',

    /**
     * Generate the next state in the sequence.
     *
     * @returns {number} The output bit.
     *
     * @example <caption>How the next state is calculated</caption>
     *   var lfsr = new FibonacciLFSR(3, [3, 1], 4)
     *   var state = lfsr.current_state // 4
     *   //=> 0b100
     *   var active_tapped_bits = state & this.feedback_tap_mask
     *   // = 0b100 & 0b101
     *   // = 4
     *   //=> 0b100
     *   var active_bit_count = 0
     *   for (; active_tapped_bits; active_bit_count++) {
     *     active_tapped_bits &= active_tapped_bits - 1
     *   }
     *   var input_bit = active_bit_count % 2
     *   // = 1 % 2
     *   //=> 1
     *   state >>= 1 // 2
     *   //=> 0b010
     *   state |= (input_bit << (this.m - 1))
     *   // = 1 << (3 - 1)
     *   //=> 110
     *   state & 1 // 0
     *   //=> 0
     */
    value: function next() {
      var state = this.current_state;

      // The input bit is the binary sum (XOR) of the feedback taps' values.
      var active_tapped_bits = state & this.feedback_tap_mask;
      var active_bit_count = (0, _populationCount2.default)(active_tapped_bits);
      var input_bit = active_bit_count % 2;

      // Drop previous output bit.
      state >>= 1;
      // Prepend the input bit.
      //
      // @note `-1` because the input bit takes up a slot.
      state |= input_bit << this.m - 1;

      this.current_state = state;

      return this.output_bit;
    }

    /**
     * Validate and process feedback tap indices.
     *
     * @type {number[]}
     */

  }, {
    key: 'sanitized_feedback_taps',
    get: function get() {
      var _this2 = this;

      var taps = _get(Object.getPrototypeOf(FibonacciLFSR.prototype), 'sanitized_feedback_taps', this);

      // Fibonacci LFSRs always use the last tap (`tap_j = m`). It will be
      // manually added in as part of setting the tap mask.
      var adjusted = taps.filter(function (tap_j) {
        return tap_j < _this2.m;
      }).map(function (tap_j) {
        return _this2.m - (tap_j - 1);
      });
      adjusted.push(1);

      return adjusted;
    }
  }]);

  return FibonacciLFSR;
}(_lfsr2.default);

exports.default = FibonacciLFSR;
//# sourceMappingURL=fibonacci-lfsr.js.map