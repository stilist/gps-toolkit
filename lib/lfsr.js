'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('babel-polyfill');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Filter an array to unique items.
 *
 * @param {Array} array - The array to process.
 * @returns {Array} The unique items in `array`.
 *
 * @access private
 */
function uniq(array) {
  if (typeof array.length === 'undefined') return [];

  var seen = [];
  var unique = [];

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = array[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      if (seen.indexOf(item) === -1) unique.push(item);
      seen.push(item);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return unique;
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

var LFSR = function () {
  /**
   * @param {number} m - Number of taps in the register.
   * @param {number[]} [feedback_taps=[1]] - Indices of taps that affect the
   *   output (range `1..m` inclusive).
   * @param {(number|string)} [seed=1] - Starting value for the generator.
   *
   * @throws {TypeError}
   */

  function LFSR() {
    var m = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
    var feedback_taps = arguments.length <= 1 || arguments[1] === undefined ? [1] : arguments[1];
    var seed = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

    _classCallCheck(this, LFSR);

    if (typeof m !== 'number') throw new TypeError('m must be Number');

    // Make sure the entire `m` sequence can be stored in a `Number` even if
    // `feedback_taps` is configured to generate an m-sequence.
    this.m = m;
    if (m < 1 || this.maximum_sequence_length > Number.MAX_SAFE_INTEGER) {
      var max_m = ~ ~Math.sqrt(Number.MAX_SAFE_INTEGER);
      throw new TypeError('m must be in the range 1..' + max_m + ' (inclusive)');
    }

    if (typeof feedback_taps.length === 'undefined') {
      throw new TypeError('feedback_taps must be null or Array');
    }
    // Handle empty array.
    if (!feedback_taps.length) feedback_taps = [1];
    this.feedback_taps = feedback_taps;

    if (seed && typeof seed !== 'number' && typeof seed !== 'string') {
      throw new TypeError('seed must be null, Number, or String');
    }
    this.provided_seed = seed;
    this.current_state = this.seed;
  }

  /**
   * Generate the next state in the sequence.
   *
   * @returns {number} The output bit.
   * @throws {Error}
   *
   * @abstract
   */


  _createClass(LFSR, [{
    key: 'next',
    value: function next() {
      throw new Error('`next` must be implemented by subclasses');
    }

    /**
     * LFSRs have a maximum of `2**m` states. One of those is fairly useless: if
     * seeded with all `0`s, the LFSR will never transition to any other state.
     * However, LFSR can never transition *into* that state either, so the LFSR
     * can cycle through a maximum of `2**m - 1` states.
     *
     * @type {number}
     */

  }, {
    key: 'maximum_sequence_length',
    get: function get() {
      if (this._maximum_sequence_length) return this._maximum_sequence_length;

      var max_length = Math.pow(2, this.m) - 1;

      this._maximum_sequence_length = max_length;
      return max_length;
    }

    /**
     * Validates the user's seed and sets a fallback value.
     *
     * @type {number}
     */

  }, {
    key: 'seed',
    get: function get() {
      if (this._seed) return this._seed;

      var bitstring = this.provided_seed;

      // Coerce numbers to bitstrings to simplify length sanitization.
      if (typeof bitstring === 'number') bitstring = bitstring.toString(2);

      // Ensure the seed is at most `m` bits long.
      bitstring = bitstring.slice(-this.m);
      // Convert back to a number.
      var seed = parseInt(bitstring, 2);

      this._seed = seed;
      return seed;
    }

    /**
     * Validate and process feedback tap indices.
     *
     * @type {number[]}
     *
     * @access protected
     */

  }, {
    key: 'sanitized_feedback_taps',
    get: function get() {
      var _this = this;

      if (this._sanitized_feedback_taps) return this._sanitized_feedback_taps;

      var taps = this.feedback_taps;
      var unique = uniq(taps);

      // Reject any indices outside the range `1..m`.
      var valid = unique.filter(function (tap_j) {
        return tap_j > 0 && tap_j <= _this.m;
      });

      this._sanitized_feedback_taps = valid;
      return valid;
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

  }, {
    key: 'feedback_tap_mask',
    get: function get() {
      if (this._feedback_tap_mask) return this._feedback_tap_mask;

      var taps = this.sanitized_feedback_taps;

      // `1 << tap_j - 1` makes a one followed by `tap_j - 1` zeroes; that value
      // is then ORed with `mask`, which sets bit `tap_j - 1` of `mask` to `1`.
      var mask = taps.reduce(function (memo, tap_j) {
        return memo | 1 << tap_j - 1;
      }, 0);

      this._feedback_tap_mask = mask;
      return mask;
    }
  }]);

  return LFSR;
}();

exports.default = LFSR;
//# sourceMappingURL=lfsr.js.map