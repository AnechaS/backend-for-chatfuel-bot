const mongoose = require('mongoose');
const createError = require('http-errors');
const { BLACKLIST_MODELS } = require('../utils/constants');

module.exports = function (req, res, next) {
  const modelName = req.params.modelName;
  if (!BLACKLIST_MODELS.includes(modelName)) {
    if (mongoose.modelNames().includes(modelName)) {
      return next();
    }
  }

  return next(createError(404));
};
