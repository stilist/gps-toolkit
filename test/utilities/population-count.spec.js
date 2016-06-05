import 'babel-polyfill'
import assert from 'assert'
import described_function from '../../src/utilities/population-count'

describe('population_count', () => {
  it('works with a 5-bit number', () => {
    let count = described_function(0b11101)

    assert.equal(count, 4)
  })

  it('works with a 8-bit number', () => {
    let count = described_function(0b11101000)

    assert.equal(count, 4)
  })

  it('works with 0', () => {
    let count = described_function(0b0)

    assert.equal(count, 0)
  })
})
