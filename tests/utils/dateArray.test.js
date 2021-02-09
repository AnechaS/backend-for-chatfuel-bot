const dateArray = require('../../app/utils/dateArray');
const moment = require('moment');

describe('dateArray', () => {
  test('should return list days', () => {
    const dateStart = new Date('2020-01-01');
    const dateEnd = moment('2020-01-07');
    const type = 'day';
    const locale = 'th';
    const format = 'D MMM';
    const dates = dateArray({ dateStart, dateEnd, type, locale, format });

    expect(dates).toHaveLength(7);
    expect(dates).toEqual(
      Array(7)
        .fill()
        .map((v, i) => `${i + 1} ม.ค.`)
    );
    expect(moment.locale()).toBe('en');
  });

  test('should return list months', () => {
    const dateStart = new Date('2020-01-01');
    const dateEnd = moment('2020-12-07');
    const type = 'month';
    const locale = 'th';
    const format = 'MMM';
    const dates = dateArray({ dateStart, dateEnd, type, locale, format });

    expect(dates).toHaveLength(12);
    expect(moment.locale()).toBe('en');
  });

  test('should return list years', () => {
    const dateStart = new Date('2019-12-07');
    const dateEnd = moment('2020-12-01');
    const type = 'year';
    const locale = 'th';
    const format = 'YYYY';
    const dates = dateArray({ dateStart, dateEnd, type, locale, format });
    expect(dates).toHaveLength(2);
    expect(moment.locale()).toBe('en');
  });
});
