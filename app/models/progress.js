const mongoose = require('mongoose');
const schemaQuery = require('../utils/schemaQuery');

const ProgressSchema = new mongoose.Schema(
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
    status: {
      type: Number,
      enum: [1, 2]
    }
  },
  {
    timestamps: true
  }
);

ProgressSchema.query = schemaQuery;

module.exports = mongoose.model('Progress', ProgressSchema);
