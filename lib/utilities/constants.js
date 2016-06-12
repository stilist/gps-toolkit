'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bits_in_number = undefined;

require('babel-polyfill');

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
 */
var bits_in_number = exports.bits_in_number = Number.MAX_SAFE_INTEGER.toString(2).length;
//# sourceMappingURL=constants.js.map