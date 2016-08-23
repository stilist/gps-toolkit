import 'babel-polyfill'

/**
* [GPS specification]{@link http://www.gps.gov/technical/icwg/IS-GPS-200H.pdf}
* (IS-GPS-200 revision H) § 3.3.4
 *
 * > GPS time [...] is referenced to Coordinated Universal Time (UTC) as
 * > maintained by the U.S. Naval Observatory (UTC (USNO)) zero time-point
 * > defined as midnight on the night of January 5, 1980/morning of January
 * > 6, 1980. The largest unit used in stating GPS time is one week defined as
 * > 604,800 seconds. GPS time may differ from UTC because GPS time shall be a
 * > continuous time scale, while UTC is corrected periodically with an integer
 * > number of leap seconds. There also is an inherent but bounded drift rate
 * > between the UTC and GPS time scales. The OCS shall control the GPS time
 * > scale to be within one microsecond of UTC (modulo one second).
 */
class Time {
  /**
   * @param {Date} [date=new Date()] - The date to use.
   *
   * @throws {RangeError}
   * @throws {TypeError}
   */
  constructor(date) {
    if (date) {
      if (Object.prototype.toString.call(date) !== '[object Date]') {
        throw new TypeError('date must be null or a Date')
      }
      if (date < this.epoch) {
        throw new RangeError('date cannot be earlier than ' + this.epoch.toDateString())
      }
    }

    this.date = date || new Date()
  }

  /**
   * @access private
   * @type {number}
   */
  get seconds_since_epoch() {
    const milliseconds_since_epoch = this.date.getTime() - this.epoch.getTime()
    return milliseconds_since_epoch / 1000
  }

  /**
   * GPS specification § 3.3.4
   *
   * > [...] equal to the number of X1 epochs that have occurred since the
   * > transition from the previous week. The count is short-cycled such that
   * > the range of the TOW-count is from 0 to 403,199 X1 epochs (equaling one
   * > week) and is reset to zero at the end of each week. The TOW-count's zero
   * > state is defined as that X1 epoch which is coincident with the start of
   * > the present week. This epoch occurs at (approximately) midnight Saturday
   * > night-Sunday morning, where midnight is defined as 0000 hours on the UTC
   * > scale which is nominally referenced to the Greenwich Meridian. Over the
   * > years the occurrence of the "zero state epoch" may differ by a few
   * > seconds from 0000 hours on the UTC scale since UTC is periodically
   * > corrected with leap seconds while the TOW-count is continuous without
   * > such correction.
   *
   * @type {number}
   */
  get time_of_week() {
    const start_of_week = new Date(this.epoch.getTime() +
                                   (this.week_number * this.seconds_in_week * 1000))

    return (this.date.getTime() - start_of_week.getTime()) / 1000 / this.x1_epoch
  }

  /**
   * GPS specification § 6.2.4
   *
   * > The GPS week numbering system is established with week number zero (0)
   * > being defined as that week which started with the X1 epoch occurring at
   * > midnight UTC (USNO) on the night of January 5, 1980/morning of January
   * > 6, 1980. The GPS week number continuously increments by one (1) at each
   * > end/start of week epoch without ever resetting to zero. [...]
   *
   * @type {number}
   */
  get week_number() {
    return Math.floor(this.seconds_since_epoch / this.seconds_in_week)
  }

  /**
   * GPS specification § 3.3.4
   *
   * > In each SV the X1 epochs of the P-code offer a convenient unit for
   * > precisely counting and communicating time. Time stated in this manner is
   * > referred to as Z-count, which is given as a binary number consisting of
   * > two parts as follows:
   * >
   * > a. The binary number represented by the 19 least significant bits of the
   * >   Z-count is referred to as the time of week (TOW) count and is defined
   * >   as being equal to the number of X1 epochs that have occurred since the
   * >   transition from the previous week. [...]
   * >
   * > b. The most significant bits of the Z-count are a binary representation
   * >   of the sequential number assigned to the current GPS week (see
   * >   paragraph 6.2.4).
   *
   * GPS specification § 20.3.3.2
   *
   * > [...] (The full TOW count consists of the 19 LSBs of
   * > the 29-bit Z-count). [...]
   *
   * @type {number}
   */
  get z_count() {
    return (this.week_number << 19) + this.time_of_week
  }
}
/**
 * GPS specification § 3.3.4
 *
 * > GPS time [...] is referenced to Coordinated Universal Time (UTC) as
 * > maintained by the U.S. Naval Observatory (UTC (USNO)) zero time-point
 * > defined as midnight on the night of January 5, 1980/morning of January 6,
 * > 1980.
 *
 * @type {Date}
 */
Time.prototype.epoch = new Date('1980-01-06T00:00:00Z')
/**
 * GPS specification § 3.3.4
 *
 * > The largest unit used in stating GPS time is one week defined as 604,800
 * > seconds.
 *
 * @type {number}
 */
Time.prototype.seconds_in_week = 604800 // seconds
/**
 * GPS specification § 3.3.2.2
 *
 * > The X1 epoch occurs every 1.5 seconds after 15,345,000 chips of the X1
 * > pattern have been generated.
 *
 * @type {number}
 */
Time.prototype.x1_epoch = 1.5 // seconds

export default Time
