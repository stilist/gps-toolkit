import 'babel-polyfill'
import assert from 'assert'
import DescribedClass from '../src/fibonacci-lfsr'

describe('FibonacciLFSR', () => {
  describe('.sequence', () => {
    it('matches the output of #next', () => {
      const lfsr = new DescribedClass(5, [5, 3], 0b00001)
      // @see http://pages.hmc.edu/harris/class/e11/lect7.pdf, slide 14
      const reference = 0b1000010010110011111000110111010

      assert.equal(lfsr.sequence, reference)
    })
  })

  describe('#next', () => {
    it('iterates with seed 0', () => {
      const lfsr = new DescribedClass(1, [1], 0b0)
      assert.equal(lfsr.next(), 0b0)
    })

    it('uses custom Fibonacci feedback_taps', () => {
      const lfsr = new DescribedClass(5, [5, 3])
      assert.equal(lfsr.feedback_tap_mask, 0b00101)
    })

    it('automatically inserts final feedback tap', () => {
      const lfsr = new DescribedClass(5, [3, 4])
      assert.equal(lfsr.feedback_tap_mask, 0b00111)
    })

    it('iterates with maximal taps and seed', () => {
      let lfsr = new DescribedClass(10, [3, 10], 0b1111111111)
      const reference = 0b0010001110

      for (let i = 1; i <= 12; i++) lfsr.next()

      assert.equal(lfsr.current_state, reference)
    })

    it('iterates with taps and seed', () => {
      const lfsr = new DescribedClass(5, [5, 3], 0b00001)
      // @see http://pages.hmc.edu/harris/class/e11/lect7.pdf, slide 14
      const reference = 0b1000010010110011111000110111010

      let sequence = 0b1
      // Add the output bit to the end of the bit sequence.
      for (let n = 1; n <= 30; n++) sequence = (sequence << 1) | lfsr.next()

      assert.equal(sequence, reference)
    })

    it('iterates state with maximal taps and seed', () => {
      const lfsr = new DescribedClass(5, [5, 3], 0b00001)
      // @see http://pages.hmc.edu/harris/class/e11/lect7.pdf, slide 14
      const reference = [0b10000, 0b01000, 0b00100, 0b10010, 0b01001, 0b10100,
                         0b11010, 0b01101, 0b00110, 0b10011, 0b11001, 0b11100,
                         0b11110, 0b11111, 0b01111, 0b00111, 0b00011, 0b10001,
                         0b11000, 0b01100, 0b10110, 0b11011, 0b11101, 0b01110,
                         0b10111, 0b01011, 0b10101, 0b01010, 0b00101, 0b00010]

      let sequence = []
      for (let n = 1; n <= reference.length; n++) {
        lfsr.next()
        sequence.push(lfsr.current_state)
      }

      assert.deepEqual(sequence, reference)
    })
  })
})
