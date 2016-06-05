'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('babel-polyfill');

/**
 * Count the number of `1`s (non-zero values) in a binary sequence.
 *
 * @param {number} n - The number to test.
 * @returns {number} The number of bits set.
 *
 * @see https://en.wikipedia.org/wiki/Hamming_weight
 * @see http://graphics.stanford.edu/~seander/bithacks.html#CountBitsSetKernighan
 */
function population_count(n) {
  var count = 0;

  // It looks odd to use just `n` as the predicate with no comparisons, but the
  // loop will exit as soon as `n` is bit shifted to be all `0`s. If there are
  // only a few bits set, and they're early in the sequence, this skips a lot
  // of iteration.
  for (; n; count++) {
    n &= n - 1;
  }return count;
}
exports.default = population_count;
//# sourceMappingURL=population-count.js.map