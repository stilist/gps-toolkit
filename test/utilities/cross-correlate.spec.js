import 'babel-polyfill'
import assert from 'assert'
import described_function from '../../src/utilities/cross-correlate'
import GoldCode from '../../src/gold-code'
import MSequence from '../../src/m-sequence'

describe('cross_correlate', () => {
  it('autocorrelates', () => {
    // @see http://pages.hmc.edu/harris/class/e11/lect7.pdf, slide 27
    let correlation = described_function(0b110010, 0b110010)
    let reference = [6, -2, -2, 2, -2, -2]

    assert.deepEqual(correlation, reference)
  })

  it('autocorrelates an LFSR', () => {
    // @see http://pages.hmc.edu/harris/class/e11/lect7.pdf, slide 28
    let lfsr = new MSequence(5)

    let reference = [lfsr.maximum_sequence_length]
    for (let i = 1; i < lfsr.maximum_sequence_length; i++) reference.push(-1)

    let correlation = described_function(lfsr.sequence, lfsr.sequence)

    assert.deepEqual(correlation, reference)
  })

  it('cross-correlates Gold codes', () => {
    // @see http://pages.hmc.edu/harris/class/e11/lect7.pdf, slide 32
    let gold_codeA = new GoldCode(5, [5, 2, 3, 4], [5, 3], 0b1)
    let gold_codeB = new GoldCode(5, [5, 2, 3, 4], [5, 3], 0b10)

    let reference = [-1, -1, -1, -9, -9, -9, -1, 7, 7, -9, -1, 7, 7, -1, -1, -1,
                     7, 7, -9, -9, -1, 7, -1, -9, -1, 7, 7, 7, -1, -1, -1]

    // @note The points on the graph are displayed in reverse order from the
    //   list of Gold code functions, so the sequences are passed in reverse
    //   to compensate.
    let correlation = described_function(gold_codeB.sequence,
                                         gold_codeA.sequence)

    assert.deepEqual(correlation, reference)
  })
})
