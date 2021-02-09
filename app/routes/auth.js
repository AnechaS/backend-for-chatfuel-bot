const express = require('express');
const { body } = require('express-validator');
const httpStatus = require('http-status');
const validator = require('../middlewares/validator');
const authorize = require('../middlewares/auth');
const APIError = require('../utils/APIError');

const SessionToken = require('../models/sessionToken');
const User = require('../models/user');

const router = express.Router();

/**
 * Login
 * @api {post} auth/login
 */
router.post(
  '/login',
  validator([
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Is required')
      .bail()
      .isEmail()
      .withMessage('Must be a valid email'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Is required')
      .bail()
      .isLength({ max: 128 })
  ]),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).exec();
      if (user && (await user.passwordMatches(password))) {
        const sessionToken = SessionToken.generate(user).token;
        const userTransformed = user.transform();
        return res.json({ ...userTransformed, sessionToken });
      }

      return next(
        new APIError({
          status: httpStatus.UNAUTHORIZED,
          message: 'Incorrect email or password'
        })
      );
    } catch (error) {
      return next(error);
    }
  }
);

/**
 * Logout
 * @api {post} auth/logout
 */
router.post('/logout', authorize(), async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    await SessionToken.deleteOne({ token });
    return res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
