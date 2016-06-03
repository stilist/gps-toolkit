import 'babel-polyfill'
import assert from 'assert'
import DescribedClass from '../src/fibonacci-lfsr'

describe('FibonacciLFSR', () => {
  describe('#next', () => {
    it('iterates with seed 0', () => {
      const lfsr = new DescribedClass(1, [1], 0b0)
      assert.equal(lfsr.next(), 0b0)
    })

    it('uses custom Fibonacci feedback_taps', () => {
      const lfsr = new DescribedClass(5, [5, 3])
      assert.equal(lfsr.feedback_tap_mask, 0b00101)
    })

    it('uses automatically inserts final feedback tap', () => {
      const lfsr = new DescribedClass(5, [3, 4])
      assert.equal(lfsr.feedback_tap_mask, 0b10011)
    })

    it('iterates with maximal taps and seed', () => {
      let lfsr = new DescribedClass(10, [3, 10], 0b1111111111)
      const reference = 0b0010001110

      for (let i = 1; i <= 12; i++) lfsr.next()

      assert.equal(lfsr.current_state, reference)
    })
  })
})
