import 'babel-polyfill'
import assert from 'assert'
import described_class from '../src/fibonacci-lfsr'

describe('FibonacciLFSR', () => {
  describe('#next', () => {
    it('iterates with seed 0', () => {
      const lfsr = new described_class(1, [1], 0b0)
      assert.equal(lfsr.next(), 0b0)
    })

    it('iterates with maximal taps and seed', () => {
      let lfsr = new described_class(10, [3, 10], 0b1111111111)
      const reference = 0b0010001110

      for (let i = 1; i <= 12; i++) lfsr.next()

      assert.equal(lfsr.current_state, reference)
    })
  })
})
