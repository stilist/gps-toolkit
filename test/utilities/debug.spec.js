import 'babel-polyfill'
import assert from 'assert'
import * as described from '../../src/utilities/debug'

describe('bits_to_string', () => {
  it('throws an error if number is not a String', () => {
    assert.throws(() => { described.bits_to_string([]) },
                  TypeError)
  })

  it('throws an error if length is not a String', () => {
    assert.throws(() => { described.bits_to_string('0', '5') },
                  TypeError)
  })

  it('works with a small number', () => {
    let result = described.bits_to_string(10, 5)

    assert.equal(result, '01010')
  })

  it('works with a larger string', () => {
    let result = described.bits_to_string(1023, 5)

    assert.equal(result, '1111111111')
  })
})

describe('log_taps', () => {
  it('throws an error if taps is not an Array', () => {
    assert.throws(() => { described.log_taps(1) },
                  TypeError)
  })

  it('throws an error if current_state is not a Number', () => {
    assert.throws(() => { described.log_taps([], '1') },
                  TypeError)
  })

  it('throws an error if length is not a Number', () => {
    assert.throws(() => { described.log_taps([], 1, '1') },
                  TypeError)
  })

  it('logs taps', () => {
    let result = described.log_taps([5], 0b10, 5)

    assert.equal(result, `00010\n•    `)
  })

  it('adjusts a negative length', () => {
    let result = described.log_taps([5], 0b10, -5)

    assert.equal(result, `00010\n•    `)
  })
})
