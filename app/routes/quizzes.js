const express = require('express');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const APIError = require('../utils/APIError');
const authorize = require('../middlewares/auth');
const prepareQuery = require('../middlewares/prepareQuery');

const Quiz = require('../models/quiz');

const router = express.Router();

/**
 * Load document when API with id route parameter is hit
 */
const load = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.Types.ObjectId.isValid(id)) {
      const quiz = await Quiz.findById(id).withJSON(req.query);
      if (quiz) {
        req.quiz = quiz;
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
 * List quizzes
 * @api {get} /quizzes
 */
router.get('/', authorize(), prepareQuery(), async (req, res, next) => {
  try {
    const { count, ...query } = req.query;
    let queryResults;
    if (!(query.limit === 0 && count)) {
      queryResults = Quiz.find().withJSON({ limit: 100, ...query });
    }

    let queryCount;
    if (count) {
      queryCount = Quiz.countDocuments().withJSON(query);
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
 * Create a new quiz
 * @api {post} /quizzes
 */
router.post('/', authorize(), async (req, res, next) => {
  try {
    const object = req.body;
    const quiz = await Quiz.create(object);
    return res.status(httpStatus.CREATED).json(quiz);
  } catch (error) {
    return next(error);
  }
});

/**
 * Get a quiz
 * @api {post} /quizzes
 */
router.get('/:id', authorize(), load, (req, res) => res.json(req.quiz));

/**
 * Update quiz
 * @api {put} /quizzes/:id
 */
router.put('/:id', authorize(), load, async (req, res, next) => {
  try {
    const object = req.body;
    const quiz = Object.assign(req.quiz, object);
    const savedQuiz = await quiz.save();
    return res.json(savedQuiz);
  } catch (error) {
    return next(error);
  }
});

/**
 * Delete a schedule
 * @api {delete} /quizzes/:id
 */
router.delete('/:id', authorize(), load, async (req, res, next) => {
  try {
    const quiz = req.quiz;
    await quiz.remove();
    return res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
