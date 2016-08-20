import 'babel-polyfill'
import assert from 'assert'
import DescribedClass from '../src/ca-encoder-g1'

describe('CAEncoderG1', () => {
  describe('#next', () => {
    it('matches expected output', () => {
      let lfsr = new DescribedClass()

      let sequence = [0b1]
      for (let n = 1; n < 30; n++) sequence.push(lfsr.next())

      let reference = [0b1, 0b1, 0b1, 0b1, 0b1, 0b1, 0b1, 0b1, 0b1, 0b1, 0b0,
                       0b0, 0b0, 0b1, 0b1, 0b1, 0b0, 0b0, 0b0, 0b1, 0b0, 0b0,
                       0b1, 0b1, 0b1, 0b0, 0b1, 0b1, 0b0, 0b0]

      assert.deepEqual(sequence, reference)
    })
  })

  describe('.sequence', () => {
    it('matches expected output', () => {
      let lfsr = new DescribedClass()

      let reference = 89806585008974840452701836212248574530343150051528837453158674585861351539336909813801967355478021876273482910455283913644801264952635131571447119425047977699786306012059259232859285777666333156290499565832530328975064685067848543777936459566863287000727073681389817197119421411542570545834240265002140287872

      assert.equal(lfsr.sequence, reference)
    })
  })
})
