import 'babel-polyfill'
import assert from 'assert'
import described_function from '../../src/utilities/dot-product'
import FibonacciLFSR from '../../src/fibonacci-lfsr'

describe('dot_product', () => {
  it('works with short sequences', () => {
    // @see http://pages.hmc.edu/harris/class/e11/lect7.pdf, slide 23
    let product = described_function(0b110010, 0b101010)

    assert.equal(product, 2)
  })

  it('works with identical sequences', () => {
    // @see http://pages.hmc.edu/harris/class/e11/lect7.pdf, slide 24
    let product = described_function(0b101010, 0b101010)

    assert.equal(product, 6)
  })

  it('works with opposite sequences', () => {
    // @see http://pages.hmc.edu/harris/class/e11/lect7.pdf, slide 24
    let product = described_function(0b111111, 0b000000)

    assert.equal(product, -6)
  })

  it('works with uncorrelated sequences', () => {
    // @see http://pages.hmc.edu/harris/class/e11/lect7.pdf, slide 25
    let lfsrA = new FibonacciLFSR(5, [5, 3], 0b1)
    let lfsrB = new FibonacciLFSR(5, [5, 3], 0b10)

    let product = described_function(lfsrA.sequence, lfsrB.sequence)

    assert.equal(product, -1)
  })
})
