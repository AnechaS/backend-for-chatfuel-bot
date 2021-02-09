const express = require('express');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const APIError = require('../utils/APIError');
const authorize = require('../middlewares/auth');
const prepareQuery = require('../middlewares/prepareQuery');

const Schedule = require('../models/schedule');

const router = express.Router();

/**
 * Load document when API with id route parameter is hit
 */
const load = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.Types.ObjectId.isValid(id)) {
      const schedule = await Schedule.findById(id).withJSON(req.query);
      if (schedule) {
        req.schedule = schedule;
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
 * List Schedules
 * @api {get} /schedules
 */
router.get('/', authorize(), prepareQuery(), async (req, res, next) => {
  try {
    const { count, ...query } = req.query;
    let queryResults;
    if (!(query.limit === 0 && count)) {
      queryResults = Schedule.find().withJSON({ limit: 100, ...query });
    }

    let queryCount;
    if (count) {
      queryCount = Schedule.countDocuments().withJSON(query);
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
 * Create a new schedule
 * @api {post} /schedules
 */
router.post('/', authorize(), async (req, res, next) => {
  try {
    const object = req.body;
    const schedule = await Schedule.create(object);
    return res.status(httpStatus.CREATED).json(schedule);
  } catch (error) {
    return next(error);
  }
});

/**
 * Get schedule infomation
 * @api {get} /schedules/:id
 */
router.get('/:id', authorize(), load, (req, res) => res.json(req.schedule));

/**
 * Update schedule
 * @api {put} /schedules/:id
 */
router.put('/:id', authorize(), load, async (req, res, next) => {
  try {
    const object = req.body;
    const schedule = Object.assign(req.schedule, object);
    const savedSchedule = await schedule.save();
    return res.json(savedSchedule);
  } catch (error) {
    return next(error);
  }
});

/**
 * Delete a schedule
 * @api {delete} /peoples/:id
 */
router.delete('/:id', authorize(), load, async (req, res, next) => {
  try {
    const schedule = req.schedule;
    await schedule.remove();
    return res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
