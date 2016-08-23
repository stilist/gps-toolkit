import 'babel-polyfill'
import assert from 'assert'
import DescribedClass from '../src/time'

describe('Time', () => {
  const y2k = new Date('2000-01-01T00:00:00Z')
  const y2k_week_number = 1042
  const y2k_sunday = new Date(y2k.getUTCFullYear(), y2k.getUTCMonth(),
                              y2k.getUTCDate() - y2k.getUTCDay())
  y2k_sunday.setUTCHours(0)
  const y2k_time_of_week = (y2k - y2k_sunday) / 1000 / DescribedClass.prototype.x1_epoch

  describe('#constructor()', () => {
    /* eslint-disable no-new */
    it('throws an error when date is not a Date', () => {
      assert.throws(() => { new DescribedClass('a') },
                    TypeError)
    })

    it('throws an error when date < epoch', () => {
      assert.throws(() => { new DescribedClass(new Date(1900)) },
                    RangeError)
    })
    /* eslint-enable no-new */
  })

  describe('.time_of_week', () => {
    it('matches for the start of the week', () => {
      const time = new DescribedClass(y2k_sunday)
      assert.equal(time.time_of_week, 0)
    })

    it('matches for 2000-01-01T00:00:00Z', () => {
      const time = new DescribedClass(y2k)

      assert.equal(time.time_of_week, y2k_time_of_week)
    })
  })

  describe('.week_number', () => {
    it('matches for epoch', () => {
      const time = new DescribedClass(DescribedClass.prototype.epoch)
      assert.equal(time.week_number, 0)
    })

    it('matches for 2000-01-01', () => {
      const time = new DescribedClass(y2k)
      assert.equal(time.week_number, y2k_week_number)
    })
  })

  describe('.z_count', () => {
    it('matches for epoch', () => {
      const time = new DescribedClass(DescribedClass.prototype.epoch)
      assert.equal(time.z_count, 0b0000000000000000000)
    })

    it('matches for 2000-01-01', () => {
      const time = new DescribedClass(y2k)

      const reference = (y2k_week_number << 19) + y2k_time_of_week

      assert.equal(time.z_count, reference)
    })
  })
})
