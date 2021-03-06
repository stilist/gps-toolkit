import 'babel-polyfill'
import assert from 'assert'
import DescribedClass from '../src/galois-lfsr'

describe('GaloisLFSR', () => {
  describe('.sequence', () => {
    it('matches the output of #next', () => {
      // @see http://paginas.fe.up.pt/~hmiranda/cm/Pseudo_Noise_Sequences.pdf
      const lfsr = new DescribedClass(5, [5, 4, 2, 1], 0b11111)
      const reference = 0b1001110000110101001000101111101

      assert.equal(lfsr.sequence, reference)
    })
  })

  describe('#next()', () => {
    it('iterates with seed 0', () => {
      const lfsr = new DescribedClass(1, [1], 0b0)
      assert.equal(lfsr.next(), 0b0)
    })

    it('iterates with default seed', () => {
      const lfsr = new DescribedClass(3)
      assert.equal(lfsr.next(), 0b1)
    })

    it('uses custom Galois feedback_taps', () => {
      const lfsr = new DescribedClass(5, [4, 3])
      assert.equal(lfsr.feedback_tap_mask, 0b01100)
    })

    it('iterates with non-maximal taps', () => {
      const lfsr = new DescribedClass(3, [3])
      const reference = [0b0, 0b0, 0b1]

      let sequence = []
      for (let n = 1; n <= 3; n++) sequence.push(lfsr.next())

      assert.deepEqual(sequence, reference)
    })

    it('iterates state with non-maximal taps', () => {
      const lfsr = new DescribedClass(3, [3])
      const reference = [0b100, 0b010, 0b001]

      let sequence = []
      for (let n = 1; n <= 3; n++) {
        lfsr.next()
        sequence.push(lfsr.current_state)
      }

      assert.deepEqual(sequence, reference)
    })

    it('iterates with maximal taps', () => {
      const lfsr = new DescribedClass(3, [3, 2])
      const reference = [0b0, 0b1, 0b1, 0b1, 0b0, 0b0, 0b1]

      // @note Cycles back to the seed value (`1` / `0b001`).
      let sequence = []
      for (let n = 1; n <= 7; n++) sequence.push(lfsr.next())

      assert.deepEqual(sequence, reference)
    })

    it('iterates state with maximal taps', () => {
      const lfsr = new DescribedClass(3, [3, 2])
      const reference = [0b110, 0b011, 0b111, 0b101, 0b100, 0b010, 0b001]

      // @note Cycles back to the seed value (`1` / `0b001`).
      let sequence = []
      for (let n = 1; n <= 7; n++) {
        lfsr.next()
        sequence.push(lfsr.current_state)
      }

      assert.deepEqual(sequence, reference)
    })

    it('iterates with maximal taps and seed', () => {
      // @see http://paginas.fe.up.pt/~hmiranda/cm/Pseudo_Noise_Sequences.pdf
      const lfsr = new DescribedClass(5, [5, 4, 2, 1], 0b11111)
      const reference = [0b0, 0b0, 0b1, 0b1, 0b1, 0b0, 0b0, 0b0, 0b0, 0b1, 0b1,
                         0b0, 0b1, 0b0, 0b1, 0b0, 0b0, 0b1, 0b0, 0b0, 0b0, 0b1,
                         0b0, 0b1, 0b1, 0b1, 0b1, 0b1, 0b0, 0b1, 0b1]

      let sequence = []
      for (let n = 1; n <= lfsr.maximum_sequence_length; n++) {
        sequence.push(lfsr.next())
      }

      assert.deepEqual(sequence, reference)
    })

    it('iterates state with maximal taps and seed', () => {
      const lfsr = new DescribedClass(5, [5, 4, 2, 1], 0b11111)
      // @see http://paginas.fe.up.pt/~hmiranda/cm/Pseudo_Noise_Sequences.pdf
      const reference = [0b10100, 0b01010, 0b00101, 0b11001, 0b10111, 0b10000,
                         0b01000, 0b00100, 0b00010, 0b00001, 0b11011, 0b10110,
                         0b01011, 0b11110, 0b01111, 0b11100, 0b01110, 0b00111,
                         0b11000, 0b01100, 0b00110, 0b00011, 0b11010, 0b01101,
                         0b11101, 0b10101, 0b10001, 0b10011, 0b10010, 0b01001,
                         0b11111]

      let sequence = []
      for (let n = 1; n <= lfsr.maximum_sequence_length; n++) {
        lfsr.next()
        sequence.push(lfsr.current_state)
      }

      assert.deepEqual(sequence, reference)
    })
  })
})
