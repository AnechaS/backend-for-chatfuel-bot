const config = require('config');
const createError = require('http-errors');
const httpStatus = require('http-status');

module.exports = function(req, res, next) {
  const apiKey = req.get('X-API-Key');
  if (apiKey !== config.get('apiKey')) {
    return next(createError(httpStatus.UNAUTHORIZED));
  }

  return next();
};