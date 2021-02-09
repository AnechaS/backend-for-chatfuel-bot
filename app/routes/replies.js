const express = require('express');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const APIError = require('../utils/APIError');
const authorize = require('../middlewares/auth');
const prepareQuery = require('../middlewares/prepareQuery');

const Reply = require('../models/reply');

const router = express.Router();

/**
 * Load document when API with id route parameter is hit
 */
const load = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.Types.ObjectId.isValid(id)) {
      const reply = await Reply.findById(id).withJSON(req.query);
      if (reply) {
        req.reply = reply;
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
 * List replies
 * @api {get} /replies
 * TODO: on set param results equal 0 then not query docs
 */
router.get('/', authorize(), prepareQuery(), async (req, res, next) => {
  try {
    const { count, ...query } = req.query;
    let queryResults;
    if (!(query.limit === 0 && count)) {
      queryResults = Reply.find().withJSON({ limit: 100, ...query });
    }

    let queryCount;
    if (count) {
      queryCount = Reply.countDocuments().withJSON(query);
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
 * Create a new reply
 * @api {post} /replies
 */
router.post('/', authorize(), async (req, res, next) => {
  try {
    const object = req.body;
    const reply = await Reply.create(object);
    return res.status(httpStatus.CREATED).json(reply);
  } catch (error) {
    return next(error);
  }
});

/**
 * Create reply infomation
 * @api {post} /replies
 */
router.get('/:id', authorize(), load, (req, res) => res.json(req.reply));

/**
 * Update reply
 * @api {put} /replies/:id
 */
router.put('/:id', authorize(), load, async (req, res, next) => {
  try {
    const object = req.body;
    const reply = Object.assign(req.reply, object);
    const savedReply = await reply.save();
    return res.json(savedReply);
  } catch (error) {
    return next(error);
  }
});

/**
 * Delete a reply
 * @api {delete} /replies/:id
 */
router.delete('/:id', authorize(), load, async (req, res, next) => {
  try {
    const reply = req.reply;
    await reply.remove();
    return res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
