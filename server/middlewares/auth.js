const createError = require('http-errors');
const httpStatus = require('http-status');
const moment = require('moment');
const Session = require('../models/session.model');

const handleAuthorize = async (req, res, next /* , roles */) => {
  try {
    const sessionToken = req.get('X-Session-Token');

    // check property authorization in headers not provide
    if (!sessionToken) {
      return next(createError(httpStatus.UNAUTHORIZED));
    }

    const session = await Session.findOne({ sessionToken }).populate('user');

    // check session token is exists database
    if (!session) {
      return next(createError(httpStatus.UNAUTHORIZED));
    }

    // check session token is expires
    if (moment(session.expiresAt).isBefore()) {
      return next(
        createError(httpStatus.UNAUTHORIZED, 'Session token expired.')
      );
    }

    // TODO: Promission Role admin, readWrite, read
    // if (roles.length) {
    //   if (!roles.includes(user.role)) {
    //     return next(
    //       createError(httpStatus.FORBIDDEN, 'Session token expired.')
    //     );
    //   }
    // }

    req.user = Object.assign({}, session.user.transform(), { sessionToken });
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = function (...roles) {
  return (req, res, next) => handleAuthorize(req, res, next, roles);
};
