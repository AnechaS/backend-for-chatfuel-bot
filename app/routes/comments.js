const express = require('express');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const APIError = require('../utils/APIError');
const authorize = require('../middlewares/auth');
const prepareQuery = require('../middlewares/prepareQuery');

const Comment = require('../models/comment');

const router = express.Router();

/**
 * Load document when API with id route parameter is hit
 */
const load = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.Types.ObjectId.isValid(id)) {
      const comment = await Comment.findById(id).withJSON(req.query);
      if (comment) {
        req.comment = comment;
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
};

/**
 * List comments
 * @api {get} /comments
 */
router.get('/', authorize(), prepareQuery(), async (req, res, next) => {
  try {
    const { count, ...query } = req.query;
    let queryResults;
    if (!(query.limit === 0 && count)) {
      queryResults = Comment.find().withJSON({ limit: 100, ...query });
    }

    let queryCount;
    if (count) {
      queryCount = Comment.countDocuments().withJSON(query);
    }

    const [results = [], countResults] = await Promise.all([
      queryResults,
      queryCount
    ]);

    return res.json({ results, count: countResults });
  } catch (error) {
    return next(error);
  }
});

/**
 * Create comment
 * @api {post} /comments
 */
router.post('/', authorize(), async (req, res, next) => {
  try {
    const object = req.body;
    const comment = await Comment.create(object);
    return res.status(httpStatus.CREATED).json(comment);
  } catch (error) {
    return next(error);
  }
});

/**
 * Get comment information
 * @api {post} /comments
 */
router.get('/:id', authorize(), load, (req, res) => res.json(req.comment));

/**
 * Update a comment
 * @api {put} /comments/:id
 */
router.put('/:id', authorize(), load, async (req, res, next) => {
  try {
    const object = req.body;
    const comment = Object.assign(req.comment, object);
    const savedReply = await comment.save();
    return res.json(savedReply);
  } catch (error) {
    return next(error);
  }
});

/**
 * Delete a comment
 * @api {delete} /comments/:id
 */
router.delete('/:id', authorize(), load, async (req, res, next) => {
  try {
    const comment = req.comment;
    await comment.remove();
    return res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
