/**
 * Sets the query conditions to the provided JSON object.
 * @param {Object} queryOptions
 * @return {Query}
 */
exports.withJSON = function(queryOptions) {
  if (queryOptions.where) {
    this.where(queryOptions.where);
  }

  if (queryOptions.sort) {
    this.sort(queryOptions.sort);
  }

  if (queryOptions.select) {
    this.select(queryOptions.select);
  }

  if (queryOptions.skip) {
    this.skip(queryOptions.skip);
  }

  if (queryOptions.populate) {
    this.populate(queryOptions.populate);
  }

  if (
    queryOptions.limit &&
    this.op.indexOf('count') === -1 &&
    !queryOptions.distinct
  ) {
    this.limit(queryOptions.limit);
  }

  if (queryOptions.distinct) {
    this.distinct(queryOptions.distinct);
  }

  return this;
};
