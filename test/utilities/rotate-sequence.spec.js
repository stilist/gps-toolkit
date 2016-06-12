import 'babel-polyfill'
import assert from 'assert'
import { bits_in_number } from '../../src/utilities/constants'
import * as described from '../../src/utilities/rotate-sequence'

describe('rotate_array', () => {
  it('throws an error if array is not a Array', () => {
    assert.throws(() => { described.rotate_array(1) },
                  TypeError)
  })

  it('throws an error if length is not a String', () => {
    assert.throws(() => { described.rotate_array([], '1') },
                  TypeError)
  })

  it('works with an empty array', () => {
    let result = described.rotate_array([])

    assert.deepEqual(result, [])
  })

  it('defaults to distance 1', () => {
    let result = described.rotate_array([1, 2, 3])

    assert.deepEqual(result, [3, 1, 2])
  })

  it('works with a small array', () => {
    let result = described.rotate_array([1, 2, 3], 1)

    assert.deepEqual(result, [3, 1, 2])
  })

  it('converts distance to a positive value', () => {
    let result = described.rotate_array([1, 2, 3], -1)

    assert.deepEqual(result, [3, 1, 2])
  })

  it('works with a larger array', () => {
    let result = described.rotate_array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 7)

    assert.deepEqual(result, [4, 5, 6, 7, 8, 9, 10, 1, 2, 3])
  })
})

describe('rotate_number_bits', () => {
  it('throws an error if array is not a Number', () => {
    assert.throws(() => { described.rotate_number_bits('1') },
                  TypeError)
  })

  it('throws an error if length is not a String', () => {
    assert.throws(() => { described.rotate_number_bits(0b1, '5') },
                  TypeError)
  })

  it('works with 0', () => {
    let result = described.rotate_number_bits(0b0)

    assert.equal(result, 0)
  })

  it('defaults to distance 1', () => {
    let result = described.rotate_number_bits(0b1)
    let reference = '1' + '0'.repeat(bits_in_number - 1)

    assert.equal(result, parseInt(reference, 2))
  })

  it('defaults to bits_length 53', () => {
    let result = described.rotate_number_bits(0b1, 1)
    let reference = '1' + '0'.repeat(bits_in_number - 1)

    assert.equal(result, parseInt(reference, 2))
  })

  it('works with small bits_length', () => {
    let result = described.rotate_number_bits(0b1, 1, 2)

    assert.equal(result, 0b10)
  })

  it('converts distance to a positive value', () => {
    let result = described.rotate_number_bits(0b1, -1, 2)

    assert.equal(result, 0b10)
  })

  it('works with a large number', () => {
    let input_number = '1'.repeat(bits_in_number - 1) + '0'
    let result = described.rotate_number_bits(parseInt(input_number, 2))

    assert.equal(result, parseInt('1'.repeat(bits_in_number - 1), 2))
  })
})
