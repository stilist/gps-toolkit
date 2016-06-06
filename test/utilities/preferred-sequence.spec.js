import 'babel-polyfill'
import assert from 'assert'
import * as described from '../../src/utilities/preferred-sequence'

describe('is_preferred_sequence()', () => {
  it('throws an error for non-numbers', () => {
    assert.throws(() => { described.is_preferred_sequence('a') },
                  TypeError)
  })

  it('throws an error for invalid lengths', () => {
    assert.throws(() => { described.is_preferred_sequence(1) },
                  TypeError)
  })

  it('uses length if passed', () => {
    let result = described.is_preferred_sequence([-1, -9, 7], 5)

    assert.equal(result, true)
  })

  it('passes valid sequence', () => {
    let result = described.is_preferred_sequence([-1, -5, 3])

    assert.equal(result, true)
  })

  it('fails invalid sequence', () => {
    let result = described.is_preferred_sequence([-1, -4, 2])

    assert.equal(result, false)
  })
})

describe('preferred_sequence_values()', () => {
  it('throws an error for non-numbers', () => {
    assert.throws(() => { described.preferred_sequence_values('a') },
                  TypeError)
  })

  it('throws an error for invalid lengths', () => {
    assert.throws(() => { described.preferred_sequence_values(1) },
                  TypeError)
  })

  it('handles odd length', () => {
    // @see http://www.wirelesscommunication.nl/reference/chaptr05/cdma/codes/gold.htm
    let values = described.preferred_sequence_values(5)
    let reference = [-1, -9, 7]

    assert.deepEqual(values, reference)
  })

  it('handles even length', () => {
    // @see http://www.wirelesscommunication.nl/reference/chaptr05/cdma/codes/gold.htm
    let values = described.preferred_sequence_values(6)
    let reference = [-1, -17, 15]

    assert.deepEqual(values, reference)
  })

  it('handles large length', () => {
    // @see http://www.wirelesscommunication.nl/reference/chaptr05/cdma/codes/gold.htm
    let values = described.preferred_sequence_values(50)
    let reference = [-1, -67108865, 67108863]

    assert.deepEqual(values, reference)
  })
})
