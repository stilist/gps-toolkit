import 'babel-polyfill'
import assert from 'assert'
import described_function from '../../src/utilities/pad-bits'

describe('pad_bits', () => {
  it('throws an error if bits is not a String', () => {
    assert.throws(() => { described_function([]) },
                  TypeError)
  })

  it('throws an error if length is not a String', () => {
    assert.throws(() => { described_function('0', '5') },
                  TypeError)
  })

  it('works with a short string', () => {
    let result = described_function('10', 5)

    assert.equal(result, '00010')
  })

  it('works with a long string', () => {
    let result = described_function('1111111111', 5)

    assert.equal(result, '1111111111')
  })
})
