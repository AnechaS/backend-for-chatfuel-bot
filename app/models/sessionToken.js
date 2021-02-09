const mongoose = require('mongoose');
const crypto = require('crypto');
const moment = require('moment');

const SessionTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiresAt: {
    type: Date
  }
});

SessionTokenSchema.statics = {
  /**
   * Generate a refresh token object and saves it into the database
   *
   * @param {User} user
   * @returns {SessionToken}
   */
  generate(user) {
    const userId = user._id;
    const token = `r:${userId}.${crypto.randomBytes(40).toString('hex')}`;
    const expiresAt = moment()
      .add(30, 'days')
      .toDate();
    const tokenObject = new SessionToken({
      token,
      user,
      expiresAt
    });
    tokenObject.save();
    return tokenObject;
  }
};

const SessionToken = mongoose.model(
  'SessionToken',
  SessionTokenSchema,
  'sessionToken'
);
module.exports = SessionToken;
