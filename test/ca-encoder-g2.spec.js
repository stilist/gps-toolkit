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
      TypeError)
    })

    it('throws an error when sv is too high', () => {
      assert.throws(() => { new DescribedClass(100) },
      TypeError)
    })
    /* eslint-enable no-new */
  })

  describe('#next', () => {
    it('matches the output for SV 1', () => {
      let sv = 1
      let lfsr = new DescribedClass(sv)

      let sequence = [0b1]
      for (let n = 1; n < 30; n++) {
        sequence.push(lfsr.next())
      }

      let reference = [0b1, 0b0, 0b0, 0b1, 0b1, 0b0, 0b1, 0b1, 0b1, 0b1, 0b1,
                       0b1, 0b1, 0b1, 0b1, 0b1, 0b0, 0b0, 0b1, 0b0, 0b1, 0b1,
                       0b0, 0b1, 0b0, 0b0, 0b1, 0b0, 0b1, 0b0]

      assert.deepEqual(sequence, reference)
    })

    it('matches the output for SV 26', () => {
      let sv = 26
      let lfsr = new DescribedClass(sv)

      let sequence = [0b1]
      for (let n = 1; n < 30; n++) {
        sequence.push(lfsr.next())
      }

      let reference = [0b1, 0b0, 0b0, 0b0, 0b0, 0b0, 0b0, 0b1, 0b1, 0b1, 0b0,
                       0b0, 0b1, 0b1, 0b0, 0b0, 0b1, 0b1, 0b0, 0b0, 0b0, 0b0,
                       0b1, 0b0, 0b0, 0b1, 0b0, 0b0, 0b0, 0b0]

      assert.deepEqual(sequence, reference)
    })
  })

  describe('.sequence', () => {
    it('matches the output for SV 1', () => {
      let sv = 1
      let lfsr = new DescribedClass(sv)

      let reference = 54772333178496338542610280554494137610417939602882387486485366544569580228654458993899726654177034414541115782123068488010661455634045192025188791056486783476952709065038617052518711767381049292721208942055039727414966424984678762637035198242947397620583617851311938875592084743490014269476854817800244400968

      assert.equal(lfsr.sequence, reference)
    })

    it('matches the output for SV 26', () => {
      let sv = 26
      let lfsr = new DescribedClass(sv)

      let reference = 45574273388065938207563714743798437064097473989934098449549670561673448785288416760858092248522036304925900177947843332158966631701482973042458184827387699375614060314676463038074632873422436500612861147691328546461118023158024577747440468376797821644812514665309942347217931516937945619529089512386451158074

      assert.equal(lfsr.sequence, reference)
    })
  })
})
