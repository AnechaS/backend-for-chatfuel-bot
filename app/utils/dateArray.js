const moment = require('moment');

/**
 * List date
 * @param {{ dateStart: Date, dateEnd: Date, type: String, format: String, locale: String }}
 * @example dateArray(new Date(), '2020-01-01', 'day', 'YYYY-MM-DD')
 * @return {Array} dates
 */

module.exports = function dateArray({
  dateStart,
  dateEnd,
  type = 'day',
  format = 'YYYY-MM-DD',
  locale = moment.locale()
}) {
  if (!dateStart) {
    throw new Error('Invalid date start');
  }

  if (!dateEnd) {
    throw new Error('Invalid date end');
  }

  let result = [];
  const dStart = moment(dateStart)
    .locale(locale)
    .startOf(type);
  const dEnd = moment(dateEnd)
    .locale(locale)
    .endOf(type);

  while (dEnd.isSameOrAfter(dStart)) {
    result.push(dStart.format(format));
    dStart.add(1, type);
  }

  return result;
};
