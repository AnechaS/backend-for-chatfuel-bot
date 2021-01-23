const omitWithNull = require('../utils/omitWithNull');

module.exports = function(req, res, next) {
  req.body = omitWithNull(req.body);
  req.query = omitWithNull(req.query);

  next();
};