const mongoose = require('mongoose');
const schemaQuery = require('../utils/schemaQuery');

const QuestionSchema = new mongoose.Schema(
  {
    schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Schedule',
      index: true
    },
    name: {
      type: String,
      trim: true
    },
    type: {
      type: Number,
      enum: [1, 2, 3]
    },
    answers: {
      type: Array
    },
    correctAnswers: {
      type: [Number],
      required: true
    }
  },
  {
    timestamps: true
  }
);

QuestionSchema.query = schemaQuery;

module.exports = mongoose.model('Question', QuestionSchema);
