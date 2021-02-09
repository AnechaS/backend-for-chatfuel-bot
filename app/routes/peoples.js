const express = require('express');
const { query } = require('express-validator');
const httpStatus = require('http-status');
const People = require('../models/people');
const APIError = require('../utils/APIError');
const authorize = require('../middlewares/auth');
const validator = require('../middlewares/validator');
const prepareQuery = require('../middlewares/prepareQuery');

const router = express.Router();

/**
 * Load document when API with id route parameter is hit
 */
const load = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id.trim().length) {
      const people = await People.findById(id).withJSON(req.query);
      if (people) {
        req.people = people;
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
 * List Peoples
 * @api {get} /peoples
 */
router.get('/', authorize(), prepareQuery(), async (req, res, next) => {
  try {
    const { count, ...query } = req.query;
    let queryResults;
    if (!(query.limit === 0 && count)) {
      queryResults = People.find().withJSON({ limit: 100, ...query });
    }

    let queryCount;
    if (count) {
      queryCount = People.countDocuments().withJSON(query);
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
 * List Address province of Peoples
 * @api {get} /peoples
 */
router.get(
  '/provinces',
  authorize(),
  validator([
    query('where')
      .if(value => value)
      .isJSON()
      .customSanitizer(value => {
        return JSON.parse(value);
      }),
    query('limit')
      .if(value => value)
      .isInt()
      .toInt(),
    query('skip')
      .if(value => value)
      .isInt()
      .toInt()
  ]),
  async (req, res, next) => {
    try {
      const { where, sort, limit, skip } = req.query;
      const query = People.aggregate();
      if (where) {
        query.match(where);
      }

      query.group({
        _id: {
          province: { $ifNull: ['$province', 'อื่นๆ'] }
        },
        count: { $sum: 1 }
      });

      query.replaceRoot({
        province: '$_id.province',
        count: '$count'
      });

      if (sort) {
        query.sort(sort);
      }
      if (skip) {
        query.skip(skip);
      }
      if (limit) {
        query.limit(limit);
      }

      const results = await query;
      return res.json(results);
    } catch (error) {
      return next(error);
    }
  }
);

/**
 * List Address district of Peoples
 * @api {get} /peoples
 */
router.get(
  '/districts',
  authorize(),
  validator([
    query('where')
      .if(value => value)
      .isJSON()
      .customSanitizer(value => {
        return JSON.parse(value);
      }),
    query('limit')
      .if(value => value)
      .isInt()
      .toInt(),
    query('skip')
      .if(value => value)
      .isInt()
      .toInt()
  ]),
  async (req, res, next) => {
    try {
      const { where, sort, limit, skip } = req.query;
      const query = People.aggregate();
      if (where) {
        query.match(where);
      }

      query.group({
        _id: {
          province: { $ifNull: ['$province', 'อื่นๆ'] },
          district: {
            $cond: {
              if: {
                $gte: [{ $ifNull: ['$province', 'อื่นๆ'] }, 'อื่นๆ']
              },
              then: 'อำเภออื่นๆ',
              else: { $ifNull: ['$district', 'อำเภออื่นๆ'] }
            }
          }
        },
        count: { $sum: 1 }
      });

      query.replaceRoot({
        province: '$_id.province',
        district: '$_id.district',
        count: '$count'
      });

      if (sort) {
        query.sort(sort);
      }
      if (skip) {
        query.skip(skip);
      }
      if (limit) {
        query.limit(limit);
      }

      const results = await query;
      return res.json(results);
    } catch (error) {
      return next(error);
    }
  }
);

/**
 * Create a new people
 * @api {post} /peoples
 */
router.post('/', authorize(), async (req, res, next) => {
  try {
    const object = req.body;
    const people = await People.create(object);
    return res.status(httpStatus.CREATED).json(people);
  } catch (error) {
    return next(error);
  }
});

/**
 * Get people information
 * @api {get} /peoples/:id
 */
router.get('/:id', authorize(), load, (req, res) => res.json(req.people));

/**
 * Update people
 * @api {put} /peoples/:id
 */
router.put('/:id', authorize(), load, async (req, res, next) => {
  try {
    const object = req.body;
    const people = Object.assign(req.people, object);
    const savedPeople = await people.save();
    return res.json(savedPeople);
  } catch (error) {
    return next(error);
  }
});

/**
 * Delete a people
 * @api {delete} /peoples/:id
 */
router.delete('/:id', authorize(), load, async (req, res, next) => {
  try {
    const people = req.people;
    await people.remove();
    return res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
