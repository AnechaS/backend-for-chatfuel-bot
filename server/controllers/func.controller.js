const createError = require('http-errors');
const httpStatus = require('http-status');
const Joi = require('Joi');
const People = require('../models/people.model');
const Reply = require('../models/reply.model');

/**
 * Create or Update a people
 * 
 * Information that Response to chatfuel.
 * @see https://docs.chatfuel.com/en/articles/735122-json-api
 */
exports.people = async function (req, res, next) {
  try {
    const { id, ...body } = req.body;

    const validate = Joi.object({
      id: Joi.string()
        .pattern(/^[0-9]{16}$/, 'messenger user id')
        .required(),
    }).validate({ id });
    if (validate.error) {
      return next(createError(httpStatus.BAD_REQUEST, validate.error.message));
    }

    await People.findByIdAndUpdate(id, body, { upsert: true, new: true });

    res.json({
      messages: [{ text: 'Successfully saved the data.' }],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a reply
 */
exports.reply = async function (req, res, next) {
  try {
    const body = req.body;

    // TODO validator blockId
    const validate = Joi.object().keys({
      people: Joi.string()
        .pattern(/^[0-9]{16}$/, 'messenger user id')
        .required(),
    }).validate({ people: body.people });
    if (validate.error) {
      return next(createError(httpStatus.BAD_REQUEST, validate.error.message));
    }

    // check people is exists
    const people = await People.get(body.people);
    if (!people) {
      throw createError(httpStatus.BAD_REQUEST, '"people" is invalid');
    }

    Reply.create(body);
    res.json({});
  } catch (error) {
    next(error);
  }
};