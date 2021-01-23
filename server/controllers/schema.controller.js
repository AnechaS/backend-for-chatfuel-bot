const mongoose = require('mongoose');
const modelSchema = require('../utils/modelSchema');

/**
 * Get all model schemas
 */
exports.list = function (req, res) {
  const results = Object.keys(mongoose.models).map((modelName) => {
    return modelSchema(modelName);
  });

  res.json({ results });
};

/**
 * Get model schema
 */
exports.get = function (req, res) {
  const result = modelSchema(req.params.modelName);
  res.json(result);
};
