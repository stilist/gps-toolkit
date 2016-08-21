import 'babel-polyfill'
import assert from 'assert'
import DescribedClass from '../src/ca-encoder'

/* The GPS documentation Table 3-Ia lists the first ten bits for each SV. The
 * values are given as a `1` (binary), followed by the next nine bits as a
 * single number in octal notation. This array only lists the octal portion.
 *
 * @example <caption>SV 1</caption>
 *   "1" + parseInt(1440 - 1000, 8).toString(2)
 *   //=> "1100100000"
 */
const sv_sequence_starts = [
  null,
  0o440,
  0o620,
  0o710,
  0o744,
  0o133,
  0o455,
  0o131,
  0o454,
  0o626,
  0o504, // 10
  0o624,
  0o750,
  0o764,
  0o772,
  0o775,
  0o776,
  0o156,
  0o467,
  0o633,
  0o715, // 20
  0o746,
  0o763,
  0o063,
  0o706,
  0o743,
  0o761,
  0o770,
  0o774,
  0o127,
  0o453, // 30
  0o624,
  0o712
]

describe('CAEncoder', () => {
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

  describe('#next()', () => {
    it('matches the output for SV 1', () => {
      let sv = 1
      let lfsr = new DescribedClass(sv)

      let sequence = []
      for (let n = 1; n < 10; n++) sequence.push(lfsr.next())

      let reference = sv_sequence_starts[sv]

      assert.equal(parseInt(sequence.join(''), 2), reference)
    })

    it('matches the output for SV 26', () => {
      let sv = 26
      let lfsr = new DescribedClass(sv)

      let sequence = []
      for (let n = 1; n < 10; n++) sequence.push(lfsr.next())

      let reference = sv_sequence_starts[sv]

      assert.equal(parseInt(sequence.join(''), 2), reference)
    })
  })

  describe('.sequence', () => {
    it('matches the output for SV 1', () => {
      let sv = 1
      let lfsr = new DescribedClass(sv)

      let reference = 70300961243299044891781771415302548266012421613069359798048031237703937572752089394579818442922744829193284928577357665087535389807096155038610151445637950131345561030413514503500127199804736655272817326583348710026176285659724322345097073139509445573201070696708139682442166866325905424972128754321708868880

      assert.equal(lfsr.sequence, reference)
    })

    it('matches the output for SV 26', () => {
      let sv = 26
      let lfsr = new DescribedClass(sv)

      let reference = 88609943034034857098405803051647550120221472355768412687195473668144832487854109889169544706120670631748124453443420537508522796206411850241424509469603996341840673387990312556246338867600884554149729978224816263767605650100138439353859607186810796572662533716085200490436196721164753986578054476140649753588

      assert.equal(lfsr.sequence, reference)
    })
  })
})
