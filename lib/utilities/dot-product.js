'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('babel-polyfill');

var _populationCount = require('./population-count');

var _populationCount2 = _interopRequireDefault(_populationCount);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Calculate the dot product of two binary sequences: the difference between
 * the number of matched and mismatched bits.
 *
 * > * Large positive dot product indicates strong similarity.
 * > * Large negative dot product indicates nearly all bits differ.
 * > * Dot product near 0 indicates two sequences are uncorrelated.
 * > * Dot product of n-bit sequence with itself is n.
 *
 * @param {number} sequenceA - A binary sequence (as a `Number`).
 * @param {number} sequenceB - A binary sequence (as a `Number`).
 * @returns {number} The dot product of the sequences.
 */
function dot_product(sequenceA, sequenceB) {
  var length = Math.max(sequenceA.toString(2).length, sequenceB.toString(2).length);

  var mismatches = (0, _populationCount2.default)(sequenceA ^ sequenceB);
  var matches = length - mismatches;

  return matches - mismatches;
}
exports.default = dot_product;
//# sourceMappingURL=dot-product.js.map