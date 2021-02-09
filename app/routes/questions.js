const express = require('express');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const APIError = require('../utils/APIError');
const authorize = require('../middlewares/auth');
const prepareQuery = require('../middlewares/prepareQuery');

const Question = require('../models/question');

const router = express.Router();

/**
 * Load document when API with id route parameter is hit
 */
const load = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.Types.ObjectId.isValid(id)) {
      const question = await Question.findById(id).withJSON(req.query);
      if (question) {
        req.question = question;
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
 * List question
 * @api {get} /question
 */
router.get('/', authorize(), prepareQuery(), async (req, res, next) => {
  try {
    const { count, ...query } = req.query;
    let queryResults;
    if (!(query.limit === 0 && count)) {
      queryResults = Question.find().withJSON({ limit: 100, ...query });
    }

    let queryCount;
    if (count) {
      queryCount = Question.countDocuments().withJSON(query);
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
 * Create a new question
 * @api {post} /question
 */
router.post('/', authorize(), async (req, res, next) => {
  try {
    const object = req.body;
    const question = await Question.create(object);
    return res.status(httpStatus.CREATED).json(question);
  } catch (error) {
    return next(error);
  }
});

/**
 * Get question infomation
 * @api {get} /question/:id
 */
router.get('/:id', authorize(), load, (req, res) => res.json(req.question));

/**
 * Update question
 * @api {put} /question/:id
 */
router.put('/:id', authorize(), load, async (req, res, next) => {
  try {
    const object = req.body;
    const question = Object.assign(req.question, object);
    const savedQuestion = await question.save();
    return res.json(savedQuestion);
  } catch (error) {
    return next(error);
  }
});

/**
 * Delete a question
 * @api {delete} /question/:id
 */
router.delete('/:id', authorize(), load, async (req, res, next) => {
  try {
    const question = req.question;
    await question.remove();
    return res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
