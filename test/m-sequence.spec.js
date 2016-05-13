import 'babel-polyfill'
import assert from 'assert'
import described_class from '../src/m-sequence'

describe('MSequence', () => {
  describe('#initialize', () => {
    it('works with just m', () => {
      assert.doesNotThrow(() => { new described_class(3) },
                          TypeError)
    })

    it('sets default feedback_taps', () => {
      const lfsr = new described_class(3)
      assert.deepEqual(lfsr.feedback_taps, [3, 2])
    })

    it('sets feedback_tap_mask', () => {
      const lfsr = new described_class(3)
      assert.equal(lfsr.feedback_tap_mask, 0b110)
    })

    it('sets default seed', () => {
      const lfsr = new described_class(3)
      assert.equal(lfsr.current_state, 0b1)
    })

    it('uses custom Number seed', () => {
      const lfsr = new described_class(3, 3)
      assert.equal(lfsr.current_state, 0b11)
    })

    it('uses custom String seed', () => {
      const lfsr = new described_class(3, '11')
      assert.equal(lfsr.current_state, 0b11)
    })
  })

  describe('#next', () => {
    it('iterates with seed 0', () => {
      const lfsr = new described_class(1, 0b0)
      assert.equal(lfsr.next(), 0b0)
    })

    it('iterates with m=5', () => {
      const m = 5
      const lfsr = new described_class(m, 0b11111)
      const reference = [0b1, 0b1, 0b0, 0b0, 0b0, 0b1, 0b1, 0b0, 0b1, 0b1, 0b1,
                         0b0, 0b1, 0b0, 0b1, 0b0, 0b0, 0b0, 0b0, 0b1, 0b0, 0b0,
                         0b1, 0b0, 0b1, 0b1, 0b0, 0b0, 0b1, 0b1, 0b1]

      const sequence_length = Math.pow(2, m) - 1
      let sequence = []
      for (let n = 1; n <= sequence_length; n++) sequence.push(lfsr.next())

      assert.deepEqual(sequence, reference)
    })

    it('iterates state with m=5', () => {
      const m = 5
      const lfsr = new described_class(m, 0b11111)
      const reference = [0b11011, 0b11001, 0b11000, 0b01100, 0b00110, 0b00011,
                         0b10101, 0b11110, 0b01111, 0b10011, 0b11101, 0b11010,
                         0b01101, 0b10010, 0b01001, 0b10000, 0b01000, 0b00100,
                         0b00010, 0b00001, 0b10100, 0b01010, 0b00101, 0b10110,
                         0b01011, 0b10001, 0b11100, 0b01110, 0b00111, 0b10111,
                         0b11111]

      const sequence_length = Math.pow(2, m) - 1
      let sequence = []
      for (let n = 1; n <= sequence_length; n++) {
        lfsr.next()
        sequence.push(lfsr.current_state)
      }

      assert.deepEqual(sequence, reference)
    })

    it('iterates with m=3 and seed', () => {
      const m = 3
      const lfsr = new described_class(m, 0b111)
      const reference = [0b1, 0b0, 0b0, 0b1, 0b0, 0b1, 0b1]

      const sequence_length = Math.pow(2, m) - 1
      let sequence = []
      for (let n = 1; n <= sequence_length; n++) sequence.push(lfsr.next())

      assert.deepEqual(sequence, reference)
    })

    it('iterates state with m=3 and seed', () => {
      const m = 3
      const lfsr = new described_class(m, 0b111)
      const reference = [0b101, 0b100, 0b010, 0b001, 0b110, 0b011, 0b111]

      const sequence_length = Math.pow(2, m) - 1
      let sequence = []
      for (let n = 1; n <= sequence_length; n++) {
        lfsr.next()
        sequence.push(lfsr.current_state)
      }

      assert.deepEqual(sequence, reference)
    })
  })
})
