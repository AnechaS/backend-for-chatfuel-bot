const httpStatus = require('http-status');
const createError = require('http-errors');
const Joi = require('joi');
const Session = require('../models/session.model');
const User = require('../models/user.model');

exports.login = async function (req, res, next) {
  try {
    const { email, password } = req.body;

    const validate = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }).validate({ email, password });

    if (validate.error) {
      return next(createError(httpStatus.BAD_REQUEST, validate.error.message));
    }

    const user = await User.findOne({ email }).exec();
    if (user && (await user.passwordMatches(password))) {
      const session = Session.generate(user);
      const response = {
        ...user.transform(),
        sessionToken: session.sessionToken,
      };

      return res.json(response);
    }

    return next(
      createError(httpStatus.UNAUTHORIZED, 'Incorrect email or password')
    );
  } catch (error) {
    return next(error);
  }
};

exports.logout = async function (req, res, next) {
  try {
    const { sessionToken } = req.user;
    await Session.deleteOne({ sessionToken });
    return res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    return next(error);
  }
};
