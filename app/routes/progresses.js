const express = require('express');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const APIError = require('../utils/APIError');
const authorize = require('../middlewares/auth');
const prepareQuery = require('../middlewares/prepareQuery');

const Progress = require('../models/progress');

const router = express.Router();

/**
 * Load document when API with id route parameter is hit
 */
const load = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.Types.ObjectId.isValid(id)) {
      const progress = await Progress.findById(id).withJSON(req.query);
      if (progress) {
        req.progress = progress;
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
 * List progresses
 * @api {get} /progresses
 */
router.get('/', authorize(), prepareQuery(), async (req, res, next) => {
  try {
    const { count, ...query } = req.query;
    let queryResults;
    if (!(query.limit === 0 && count)) {
      queryResults = Progress.find().withJSON({ limit: 100, ...query });
    }

    let queryCount;
    if (count) {
      queryCount = Progress.countDocuments().withJSON(query);
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
 * Create a new progress
 * @api {post} /progresses
 */
router.post('/', authorize(), async (req, res, next) => {
  try {
    const object = req.body;
    const progress = await Progress.create(object);
    return res.status(httpStatus.CREATED).json(progress);
  } catch (error) {
    return next(error);
  }
});

/**
 * Get progress information
 * @api {get} /progresses/:id
 */
router.get('/:id', authorize(), load, (req, res) => res.json(req.progress));

/**
 * Update progress
 * @api {put} /progresses/:id
 */
router.put('/:id', authorize(), load, async (req, res, next) => {
  try {
    const object = req.body;
    const progress = Object.assign(req.progress, object);
    const savedProgress = await progress.save();
    return res.json(savedProgress);
  } catch (error) {
    return next(error);
  }
});

/**
 * Delete a progress
 * @api {delete} /progresses/:id
 */
router.delete('/:id', authorize(), load, async (req, res, next) => {
  try {
    const progress = req.progress;
    await progress.remove();
    return res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
