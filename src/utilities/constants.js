import 'babel-polyfill'

/**
 * The number of bits used to store `Number` values.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
 */
export const bits_in_number = Number.MAX_SAFE_INTEGER.
  toString(2).
  length
