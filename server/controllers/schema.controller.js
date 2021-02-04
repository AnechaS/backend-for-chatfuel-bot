const mongoose = require('mongoose');
const { omit } = require('lodash');
const modelSchema = require('../utils/modelSchema');
const { BLACKLIST_MODELS } = require('../utils/constants');

/**
 * Get all model schemas
 */
exports.list = function (req, res) {
  const results = Object.keys(omit(mongoose.models, BLACKLIST_MODELS)).map(
    (modelName) => {
      return modelSchema(modelName);
    }
  );

  res.json({ results });
};

/**
 * Get model schema
 */
exports.get = function (req, res) {
  const result = modelSchema(req.params.modelName);
  res.json(result);
};
