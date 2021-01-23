const mongoose = require('mongoose');

const Schema = new mongoose.Schema(
  {
    people: {
      type: String,
      ref: 'People',
      index: true,
      required: true,
    },
    value: {
      type: String,
      trim: true,
    },
    submittedType: {
      type: String,
      enum: ['button', 'textInput', 'file', 'freeform'],
    },
    blockId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Reply', Schema);
