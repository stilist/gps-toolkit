import 'babel-polyfill'
import assert from 'assert'
import DescribedClass from '../src/gold-code'

describe('GoldCode', () => {
  describe('.length', () => {
    it('matches for m=3', () => {
      const lfsr = new DescribedClass(3)
      assert.equal(lfsr.length, 7)
    })

    it('matches for m=53', () => {
      const lfsr = new DescribedClass(53)
      assert.equal(lfsr.length, Math.pow(2, 53) - 1)
    })
  })

  describe('.sequence', () => {
    it('matches with different taps', () => {
      let gold_code = new DescribedClass(5, [5, 2, 3, 4], [5, 3], 0b1)
      // @see http://pages.hmc.edu/harris/class/e11/lect7.pdf, slide 21
      let reference = 0b0000000100011011000011001110011

      assert.equal(gold_code.sequence, reference)
    })

    it('matches with different taps and seeds', () => {
      let gold_code = new DescribedClass(5, [5, 2, 3, 4], [5, 3], 0b10)
      // @see http://pages.hmc.edu/harris/class/e11/lect7.pdf, slide 21
      let reference = 0b1100011111110001000111100010100

      assert.equal(gold_code.sequence, reference)
    })
  })

  describe('#next()', () => {
    it('matches with different taps', () => {
      let gold_code = new DescribedClass(5, [5, 2, 3, 4], [5, 3], 0b1)
      // @see http://pages.hmc.edu/harris/class/e11/lect7.pdf, slide 21
      let reference = [0b0, 0b0, 0b0, 0b0, 0b0, 0b0, 0b1, 0b0, 0b0, 0b0, 0b1, 0b1,
                       0b0, 0b1, 0b1, 0b0, 0b0, 0b0, 0b0, 0b1, 0b1, 0b0, 0b0, 0b1,
                       0b1, 0b1, 0b0, 0b0, 0b1, 0b1]

      let sequence = []
      for (let i = 1; i <= reference.length; i++) {
        sequence.push(gold_code.next())
      }

      assert.deepEqual(sequence, reference)
    })
  })
})
