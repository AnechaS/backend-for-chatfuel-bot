const mongoose = require('mongoose');
const schemaQuery = require('../utils/schemaQuery');

const QuizSchema = new mongoose.Schema(
  {
    people: {
      type: String,
      ref: 'People',
      index: true
    },
    schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Schedule',
      index: true
    },
    reply: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reply',
      index: true
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      index: true
    },
    answer: {
      type: Number,
      required: true
    },
    answerText: {
      type: String
    },
    isCorrect: {
      type: Boolean
    }
    // TODO score
  },
  {
    timestamps: true
  }
);

QuizSchema.query = schemaQuery;

module.exports = mongoose.model('Quiz', QuizSchema);
