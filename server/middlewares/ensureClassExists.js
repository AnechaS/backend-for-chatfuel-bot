const mongoose = require('mongoose');
const createError = require('http-errors');

const BLACKLISTED_MODELS = ['Session'];

module.exports = function (req, res, next) {
  const modelName = req.params.modelName;
  if (!BLACKLISTED_MODELS.includes(modelName)) {
    if (mongoose.modelNames().includes(modelName)) {
      return next();
    }
  }

  return next(createError(404));
};
