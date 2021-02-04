const createError = require('http-errors');
const httpStatus = require('http-status');
const cf = require('../utils/chatfuel');

exports.totalChatbotUsers = async function (req, res, next) {
  try {
    const response = await cf.getStats('total_users', req.query);
    return res.json(response);
  } catch (error) {
    return next(createError(httpStatus.SERVICE_UNAVAILABLE, error));
  }
};

exports.eventChatbotUsers = async function (req, res, next) {
  try {
    const response = await cf.getStats('event_users', req.query);
    return res.json(response);
  } catch (error) {
    return next(createError(httpStatus.SERVICE_UNAVAILABLE, error));
  }
};

exports.usageChatbot = async function (req, res, next) {
  try {
    const response = await cf.getStats('usage', req.query);
    return res.json(response);
  } catch (error) {
    return next(createError(httpStatus.SERVICE_UNAVAILABLE, error));
  }
};

exports.chatbotUrls = async function (req, res, next) {
  try {
    const response = await cf.getUrlsStats(req.query);
    return res.json(response);
  } catch (error) {
    return next(createError(httpStatus.SERVICE_UNAVAILABLE, error));
  }
};
