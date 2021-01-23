function parseQueryOptions(queryOptions) {
  if (queryOptions.select && typeof queryOptions.select === 'string') {
    const select = queryOptions.select.split(',');
    queryOptions.select = {};

    for (let i = 0, length = select.length; i < length; i++) {
      if (select[i][0] === '-') {
        queryOptions.select[select[i].substring(1)] = 0;
      } else {
        queryOptions.select[select[i]] = 1;
      }
    }
  }

  if (queryOptions.populate) {
    if (typeof queryOptions.populate === 'string') {
      const populate = queryOptions.populate.split(',');
      queryOptions.populate = [];

      for (let i = 0, length = populate.length; i < length; i++) {
        queryOptions.populate.push({
          path: populate[i],
        });

        for (const key in queryOptions.select) {
          if (key.indexOf(populate[i] + '.') === 0) {
            if (queryOptions.populate[i].select) {
              queryOptions.populate[i].select += ' ';
            } else {
              queryOptions.populate[i].select = '';
            }

            if (queryOptions.select[key] === 0) {
              queryOptions.populate[i].select += '-';
            }

            queryOptions.populate[i].select += key.substring(
              populate[i].length + 1
            );
            delete queryOptions.select[key];
          }
        }

        // If other specific fields are selected, add the populated field
        if (queryOptions.select) {
          if (
            Object.keys(queryOptions.select).length > 0 &&
            !queryOptions.select[populate[i]]
          ) {
            queryOptions.select[populate[i]] = 1;
          } else if (Object.keys(queryOptions.select).length === 0) {
            delete queryOptions.select;
          }
        }
      }
    } else if (!Array.isArray(queryOptions.populate)) {
      queryOptions.populate = [queryOptions.populate];
    }
  }

  return queryOptions;
}

module.exports = function (obj) {
  const whitelist = [
    'distinct',
    'limit',
    'populate',
    'where',
    'select',
    'skip',
    'sort',
  ];

  const query = {};

  for (const key in obj) {
    if (whitelist.indexOf(key) === -1) {
      continue;
    }

    if (key === 'where') {
      try {
        query[key] = JSON.parse(obj[key]);
      } catch (error) {
        const e = new Error(`"${key}" must be a json`);
        e.private = true;
        throw e;
      }
    } else if (key === 'populate' || key === 'select' || key === 'sort') {
      try {
        query[key] = JSON.parse(obj[key]);
      } catch (e) {
        query[key] = obj[key];
      }
    } else if (key === 'limit' || key === 'skip') {
      query[key] = parseInt(obj[key]);
    } else {
      query[key] = obj[key];
    }
  }

  return parseQueryOptions(query);
};
