const logger = require('../app/utils/logger');
const mean = require('lodash/mean');

logger.query(
  {
    from: new Date('2020-06-01'),
    until: new Date(),
    order: 'asc'
  },
  (err, results) => {
    if (err) {
      throw err;
    }

    const r = results.server.filter(
      o => /chatfuel\/(people|reply|comment)/.test(o.message)
    );
    const times = r.map(o => {
      let time = o.message.split(' - ').pop();
      time = Number(time.split(' ')[0]);
      return time;
    });

    console.log('All request count: %i', results.server.length);
    console.log('Chatfuel request count: %i', r.length);
    console.log('Chatfuel time processing: %i ms', mean(times));
  }
);
