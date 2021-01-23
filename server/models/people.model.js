const mongoose = require('mongoose');
const crypto = require('crypto');
const uniqueValidator = require('mongoose-unique-validator');
const cf = require('../utils/chatfuel');

const Schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      trim: true,
      default: () => crypto.randomBytes(8).toString('hex'),
    },
    firstname: {
      type: String,
      trim: true,
    },
    lastname: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    pic: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// TODO: Fixed findOne to load chatbot users. After no value in the database
Schema.static('get', async function (id) {
  const document = await this.findById(id);
  if (document) {
    return document;
  }
  return this.load(id);
});

Schema.static('load', async function (id) {
  if (!id) {
    throw new mongoose.Error('parame is required');
  }

  const chatbotUser = await cf.getChatbotUser(id);
  if (!chatbotUser) {
    return null;
  }

  const chatbotUserTransform = cf.matchModelPaths(chatbotUser);
  delete chatbotUserTransform.id;

  // create a new people
  return this.findByIdAndUpdate(id, chatbotUserTransform, {
    upsert: true,
    new: true,
    // overwrite: true
  });
});

Schema.plugin(uniqueValidator);

module.exports = mongoose.model('People', Schema);
