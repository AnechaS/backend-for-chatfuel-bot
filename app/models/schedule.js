const mongoose = require('mongoose');
const schemaQuery = require('../utils/schemaQuery');

const ScheduleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

ScheduleSchema.query = schemaQuery;

module.exports = mongoose.model('Schedule', ScheduleSchema);
