const { validationResult } = require('express-validator');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

module.exports = function (validations) {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req).formatWith(
      ({ param, location, msg }) => ({
        field: param,
        location,
        message: msg
      })
    );
    if (!errors.isEmpty()) {
      return next(new APIError({
        message: 'Validation Error',
        status: httpStatus.BAD_REQUEST,
        errors: errors.array(),
      }));
    }

    return next();
  };
};