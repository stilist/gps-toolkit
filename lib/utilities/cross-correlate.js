'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('babel-polyfill');

var _dotProduct = require('./dot-product');

var _dotProduct2 = _interopRequireDefault(_dotProduct);

var _rotateSequence = require('./rotate-sequence');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * > In signal processing, cross-correlation is a measure of similarity of two
 * > series as a function of the lag of one relative to the other.
 * >
 * > [...]
 * >
 * > In an autocorrelation, which is the cross-correlation of a signal with
 * > itself, there will always be a peak at a lag of zero, and its size will be
 * > the signal power.
 *
 * @param {number} sequenceA - The reference sequence.
 * @param {number} sequenceB - The sequence to correlate.
 * @returns {number[]} The correlation at each offset of `sequenceB`.
 *
 * @example <caption>Correlating a sequence with itself (autocorrelation)</caption>
 *   cross_correlate(0b110010, 0b110010)
 *   //=> [6, -2, -2, 2, -2, -2]
 *
 * @see https://en.wikipedia.org/wiki/Cross-correlation
 */
function cross_correlate(sequenceA, sequenceB) {
  var length = Math.max(sequenceA.toString(2).length, sequenceB.toString(2).length);

  // Map `sequenceB` into an `Array` so it can be rotated.
  var bitsB = [];
  // @see http://stackoverflow.com/questions/14104208/convert-integer-to-binary-and-store-it-in-an-integer-array-of-specified-sizec#comment19514125_14104263
  for (var i = 0; i < length; i++) {
    bitsB[length - i] = sequenceB >> i & 1;
  }var correlations = [(0, _dotProduct2.default)(sequenceA, sequenceB, length)];
  for (var offset = 1; offset < length; offset++) {
    var rotated = (0, _rotateSequence.rotate_array)(bitsB, offset);

    var sequence = parseInt(rotated.join(''), 2);
    var correlation = (0, _dotProduct2.default)(sequenceA, sequence, length);

    correlations.push(correlation);
  }

  return correlations;
}
exports.default = cross_correlate;
//# sourceMappingURL=cross-correlate.js.map