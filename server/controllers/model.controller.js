const mongoose = require('mongoose');
const createError = require('http-errors');
const httpStatus = require('http-status');
const buildQuery = require('../utils/buildQuery');
const parseQuery = require('../utils/parseQuery');

module.exports = function (modelName) {
  const c = {};

  function model(req) {
    const index = req.params.modelName || modelName;
    const m = mongoose.models[index];
    return m;
  }

  // get, find, read, query, getDocument, findById,
  async function findById(model, id, queryOptions) {
    const err = createError(httpStatus.NOT_FOUND, 'Object not found.');
    // id type is ObjectId then validate
    if (model.schema.path('_id').instance === 'ObjectID') {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw err;
      }
    }

    const document = await buildQuery(model.findById(id), queryOptions);
    if (!document) {
      // is model people then load user chatbot
      if (model.modelName === 'People') {
        const document = model.load(id);
        if (document) {
          return document;
        }
      }

      throw err;
    }

    return document;
  }

  /**
   * List documents
   */
  c.find = async function (req, res, next) {
    try {
      const m = model(req);
      const isCount = parseInt(req.query.count);
      const query = parseQuery(req.query);

      const promises = [];
      if (!(query.limit === 0 && isCount)) {
        if (!query.limit) {
          query.limit = 100;
        }
        promises[0] = buildQuery(m.find(), query);
      }

      if (isCount) {
        promises[1] = buildQuery(m.countDocuments(), query);
      }

      const [documents, count] = await Promise.all(promises);

      const response = {
        results: documents || [],
        count,
      };

      return res.json(response);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Create document
   */
  c.create = async function (req, res, next) {
    try {
      const m = model(req);
      const object = await m.create(req.body);
      return res.status(httpStatus.CREATED).json(object);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Get document
   */
  c.get = async function (req, res, next) {
    try {
      const m = model(req);
      const query = parseQuery(req.query);
      const result = await findById(m, req.params.id, query);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Update document
   */
  c.update = async function (req, res, next) {
    try {
      const m = model(req);
      const query = parseQuery(req.query);
      let document = await findById(m, req.params.id, query);
      document = Object.assign(document, req.body);
      const result = await document.save();
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Delete document
   */
  c.delete = async function (req, res, next) {
    try {
      const m = model(req);
      const document = await findById(m, req.params.id);
      document.remove();
      return res.status(httpStatus.NO_CONTENT).end();
    } catch (error) {
      return next(error);
    }
  };

  return c;
};
