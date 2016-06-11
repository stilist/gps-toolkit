'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('babel-polyfill');

var _fibonacciLfsr = require('./fibonacci-lfsr');

var _fibonacciLfsr2 = _interopRequireDefault(_fibonacciLfsr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Implements a Gold code generator.
 *
 * @augments FibonacciLFSR
 *
 * @example <caption>A Gold code of size 5</caption>
 *   var gold_code = new GoldCode(5, [5, 2, 3, 4], [5, 3], 0b10)
 *   gold_code.next()
 *   //=> 1
 *   gold_code.sequence
 *   //=> 0b1100011111110001000111100010100
 *   gold_code.length
 *   //=> 24
 *
 * @see https://en.wikipedia.org/wiki/Gold_code
 * @see http://pages.hmc.edu/harris/class/e11/lect7.pdf
 */

var GoldCode = function () {
  /**
   * @param {number} m - Number of taps in the register.
   * @param {number[]} [feedback_taps_a] - Indices of taps that affect the
   *   output (range `1..m` inclusive).
   * @param {number[]} [feedback_taps_b] - Indices of taps that affect the
   *   output (range `1..m` inclusive).
   * @param {(number|string)} [seedB=1] - Starting value for the second LFSR.
   *
   * @throws {TypeError}
   */

  function GoldCode(m, feedback_taps_a, feedback_taps_b, seedB) {
    _classCallCheck(this, GoldCode);

    this.size = m;
    this.feedback_taps_a = feedback_taps_a;
    this.feedback_taps_b = feedback_taps_b;
    this.seedB = seedB;
  }

  /**
   * Gold codes are generated from a pair of {@link LFSR}s.
   *
   * @access protected
   * @type {FibonacciLFSR[]}
   */


  _createClass(GoldCode, [{
    key: 'next',


    /**
     * Generate the next state in the sequence.
     *
     * @returns {number} The output bit.
     */
    value: function next() {
      var _lfsrs = _slicedToArray(this.lfsrs, 2);

      var lfsrA = _lfsrs[0];
      var lfsrB = _lfsrs[1];


      return lfsrA.next() ^ lfsrB.next();
    }
  }, {
    key: 'lfsrs',
    get: function get() {
      if (this._lfsrs) return this._lfsrs;

      var lfsrA = new _fibonacciLfsr2.default(this.size, this.feedback_taps_a, 1);
      var lfsrB = new _fibonacciLfsr2.default(this.size, this.feedback_taps_b, this.seedB);

      this._lfsrs = [lfsrA, lfsrB];

      return this._lfsrs;
    }

    /**
     * The length of the Gold code sequence.
     *
     * @type {number}
     */

  }, {
    key: 'length',
    get: function get() {
      if (this._length) return this._length;

      this._length = this.lfsrs[0].maximum_sequence_length;

      return this._length;
    }

    /**
     * The complete Gold code sequence.
     *
     * @type {number}
     */

  }, {
    key: 'sequence',
    get: function get() {
      if (this._sequence) return this._sequence;

      var _lfsrs2 = _slicedToArray(this.lfsrs, 2);

      var lfsrA = _lfsrs2[0];
      var lfsrB = _lfsrs2[1];

      this._sequence = lfsrA.sequence ^ lfsrB.sequence;

      return this._sequence;
    }
  }]);

  return GoldCode;
}();

exports.default = GoldCode;
//# sourceMappingURL=gold-code.js.map