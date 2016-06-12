import 'babel-polyfill'
import assert from 'assert'
import * as constants from '../../src/utilities/constants'

describe('bits_in_number', () => {
  it('matches Number.MAX_SAFE_INTEGER', () => {
    let n = Math.pow(2, constants.bits_in_number) - 1

    assert.equal(n, Number.MAX_SAFE_INTEGER)
  })
})
