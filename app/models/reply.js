const mongoose = require('mongoose');
const { REPLY_SUBMITTED_TYPES } = require('../utils/constants');
const schemaQuery = require('../utils/schemaQuery');

const ReplySchema = new mongoose.Schema(
  {
    people: {
      type: String,
      ref: 'People',
      index: true,
      required: true
    },
    schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Schedule',
      index: true,
      required: true
    },
    blockId: {
      type: String,
      trim: true
    },
    text: {
      type: String,
      trim: true
    },
    image: {
      type: String,
      trim: true
    },
    submittedType: {
      type: String,
      enum: REPLY_SUBMITTED_TYPES
    }
  },
  {
    timestamps: true
  }
);

ReplySchema.query = schemaQuery;

module.exports = mongoose.model('Reply', ReplySchema);
