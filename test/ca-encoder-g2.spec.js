import 'babel-polyfill'
import assert from 'assert'
import DescribedClass from '../src/ca-encoder-g2'

describe('CAEncoderG2', () => {
  describe('#constructor()', () => {
    /* eslint-disable no-new */
    it('throws an error when sv is not a Number', () => {
      assert.throws(() => { new DescribedClass('a') },
                    TypeError)
    })

    it('throws an error when sv is too low', () => {
      assert.throws(() => { new DescribedClass(-1) },
                    RangeError)
    })

    it('throws an error when sv is too high', () => {
      assert.throws(() => { new DescribedClass(100) },
                    RangeError)
    })
    /* eslint-enable no-new */
  })

  describe('#next', () => {
    it('matches the output for SV 1', () => {
      let lfsr = new DescribedClass(1)

      let sequence = [lfsr.output_bit]
      for (let n = 1; n < 30; n++) sequence.push(lfsr.next())

      let reference = [0b0, 0b0, 0b1, 0b1, 0b0, 0b1, 0b1, 0b1, 0b1, 0b1, 0b1,
                       0b1, 0b1, 0b1, 0b1, 0b0, 0b0, 0b1, 0b0, 0b1, 0b1, 0b0,
                       0b1, 0b0, 0b0, 0b1, 0b0, 0b1, 0b0, 0b1]

      assert.deepEqual(sequence, reference)
    })

    it('matches the output for SV 26', () => {
      let lfsr = new DescribedClass(26)

      let sequence = [lfsr.output_bit]
      for (let n = 1; n < 30; n++) sequence.push(lfsr.next())

      let reference = [0b0, 0b0, 0b0, 0b0, 0b0, 0b0, 0b1, 0b1, 0b1, 0b0, 0b0,
                       0b1, 0b1, 0b0, 0b0, 0b1, 0b1, 0b0, 0b0, 0b0, 0b0, 0b1,
                       0b0, 0b0, 0b1, 0b0, 0b0, 0b0, 0b0, 0b1]

      assert.deepEqual(sequence, reference)
    })
  })

  describe('.sequence', () => {
    it('matches the output for SV 1', () => {
      let lfsr = new DescribedClass(1)

      let reference = 19660009613876881698755301569537038539937030258649446336255692510272822554558436421445214647150300818522174624310440297191928026860882072803953866793236504765021471417644491466886313734139051525715876408067576570410857508798126084537113841215481176659491980360330728631210546517740170386536031470788376733328

      assert.equal(lfsr.sequence, reference)
    })

    it('matches the output for SV 26', () => {
      let lfsr = new DescribedClass(26)

      let reference = 1263890033016081028662169948145637447296099032752868262384300544480559667826351955361945835840304599291743415959989985488538378995757634838492654335038336562344173916920183437998155946221825941499180819340154208503160705144817714757924381483182024707949773988326735574462240064636033086640500859960790247540

      assert.equal(lfsr.sequence, reference)
    })
  })
})
