module.exports = function (query, queryOptions) {
  const promise = new Promise((resolve) => {
    if (!queryOptions) {
      return resolve(query);
    }

    if (queryOptions.where) {
      query.where(queryOptions.where);
    }

    if (queryOptions.sort) {
      query.sort(queryOptions.sort);
    }

    if (queryOptions.skip) {
      query.skip(queryOptions.skip);
    }

    if (
      queryOptions.limit &&
      (!query.op || (query.op && query.op.indexOf('count') === -1)) &&
      !queryOptions.distinct
    ) {
      query.limit(queryOptions.limit);
    }

    if (queryOptions.populate) {
      query.populate(queryOptions.populate);
    }

    if (queryOptions.select) {
      query.select(queryOptions.select);
    }

    if (queryOptions.distinct) {
      query.distinct(queryOptions.distinct);
    }

    resolve(query);
  });

  return promise;
};
