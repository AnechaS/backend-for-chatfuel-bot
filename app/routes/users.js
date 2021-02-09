const express = require('express');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const APIError = require('../utils/APIError');
const authorize = require('../middlewares/auth');
const prepareQuery = require('../middlewares/prepareQuery');

const User = require('../models/user');
const SessionToken = require('../models/sessionToken');

const router = express.Router();

router.param('id', async (req, res, next, id) => {
  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      const user = await User.findById(id);
      if (user) {
        req.locals = user;
        return next();
      }
    }

    // object id is not exists
    throw new APIError({
      message: 'Object not found.',
      status: httpStatus.NOT_FOUND
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * List users
 * @api {get} /users
 */
router.get('/', authorize(), prepareQuery(), async (req, res, next) => {
  try {
    const { count, ...query } = req.query;
    let queryResults;
    if (!(query.limit === 0 && count)) {
      queryResults = User.find().withJSON({ limit: 100, ...query });
    }

    let queryCount;
    if (count) {
      queryCount = User.countDocuments().withJSON(query);
    }

    const [results = [], countResults] = await Promise.all([
      queryResults,
      queryCount
    ]);

    return res.json({ results, count: countResults });
  } catch (error) {
    next(error);
  }
});

/**
 * Create a new user
 * @api {post} /users
 */
router.post('/', authorize(), async (req, res, next) => {
  try {
    const object = req.body;
    const user = await User.create(object);
    return res.status(httpStatus.CREATED).json(user.transform());
  } catch (error) {
    return next(error);
  }
});

/**
 * TODO: add response session token.
 * Get user with SessionToken
 * @api {get} /users/me
 */
router.get('/me', authorize(), async (req, res, next) => {
  try {
    const user = req.user;
    res.json(user.transform());
  } catch (error) {
    next(error);
  }
});

/**
 * Get user infomation
 * @api {post} /users
 */
router.get('/:id', authorize(), async (req, res, next) => {
  try {
    const user = req.locals;
    res.json(user.transform());
  } catch (error) {
    next(error);
  }
});

/**
 * Update user
 * @api {put} /users/:id
 */
router.put('/:id', authorize(), async (req, res, next) => {
  try {
    const object = req.body;
    const user = Object.assign(req.locals, object);
    const savedUser = await user.save();

    // if set password then clean Session token
    if (object.password) {
      await SessionToken.deleteMany({ user });
    }

    return res.json(savedUser.transform());
  } catch (error) {
    return next(error);
  }
});

/**
 * Delete a user
 * @api {delete} /users/:id
 */
router.delete('/:id', authorize(), async (req, res, next) => {
  try {
    const user = req.locals;
    await user.remove();
    return res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
