const mongoose = require('mongoose');
const modelSchema = require('../../utils/modelSchema');

mongoose.model('Person', new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    power: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
));

mongoose.model('Message', new mongoose.Schema(
  {
    person: {
      type: String,
      ref: 'Person',
      index: true,
      required: true,
    },
    text: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
));

describe('modelSchema', () => {
  test('should return object', () => {
    const result = modelSchema('Person');
    expect(result.className).toBe('Person');
    expect(result.fields).toEqual({
      name: {
        type: 'String',
      },
      power: {
        type: 'Number',
      },
      _id: {
        type: 'ObjectId',
      },
      createdAt: {
        type: 'Date',
      },
      updatedAt: {
        type: 'Date',
      },
      __v: {
        type: 'Number',
      },
    });
  });
});
