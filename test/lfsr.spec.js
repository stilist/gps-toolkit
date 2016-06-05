import 'babel-polyfill'
import assert from 'assert'
import DescribedClass from '../src/lfsr'

describe('LFSR', () => {
  describe('#constructor()', () => {
    /* eslint-disable no-new */
    it('throws an error when m is not a Number', () => {
      assert.throws(() => { new DescribedClass('a') },
                    TypeError)
    })

    it('throws an error when m is < 1', () => {
      assert.throws(() => { new DescribedClass(0) },
                    TypeError)
    })

    it('throws an error when maximum sequence length is > MAX_SAFE_INTEGER', () => {
      assert.throws(() => { new DescribedClass(Number.MAX_SAFE_INTEGER) },
                    TypeError)
    })

    it('throws an error when feedback_taps is the wrong type', () => {
      assert.throws(() => { new DescribedClass(3, 1) },
                    TypeError)
    })

    it('throws an error when seed is the wrong type', () => {
      assert.throws(() => { new DescribedClass(3, [1], []) },
                    TypeError)
    })

    it('works with just m', () => {
      assert.doesNotThrow(() => { new DescribedClass(3) },
                          TypeError)
    })

    it('sets default m', () => {
      assert.doesNotThrow(() => { new DescribedClass() },
                          TypeError)
    })
    /* eslint-enable no-new */

    it('sets default feedback_taps', () => {
      const lfsr = new DescribedClass(3)
      assert.deepEqual(lfsr.feedback_taps, [1])
    })

    it('sets default feedback_taps for empty Array', () => {
      const lfsr = new DescribedClass(3, [])
      assert.deepEqual(lfsr.feedback_taps, [1])
    })

    it('sets feedback_tap_mask for default feedback_taps', () => {
      const lfsr = new DescribedClass(3)
      assert.equal(lfsr.feedback_tap_mask, 0b1)
    })

    it('sets default seed', () => {
      const lfsr = new DescribedClass(3, [1])
      assert.equal(lfsr.current_state, 0b1)
    })

    it('uses custom Number seed', () => {
      const lfsr = new DescribedClass(3, [1], 3)
      assert.equal(lfsr.current_state, 0b11)
    })

    it('uses custom String seed', () => {
      const lfsr = new DescribedClass(3, [1], '11')
      assert.equal(lfsr.current_state, 0b11)
    })

    it('sanitizes custom Number seed', () => {
      const lfsr = new DescribedClass(3, [1], 50)
      assert.equal(lfsr.current_state, 0b10)
    })

    it('uses custom String seed', () => {
      const lfsr = new DescribedClass(3, [1], (50).toString(2))
      assert.equal(lfsr.current_state, 0b10)
    })
  })

  describe('.sequence', () => {
    it('throws an error', () => {
      assert.throws(() => {
        const lfsr = new DescribedClass(3)
        lfsr.sequence
      }, Error)
    })
  })

  describe('#next()', () => {
    const lfsr = new DescribedClass(3)
    assert.throws(() => { lfsr.next() },
                  Error)
  })
})
