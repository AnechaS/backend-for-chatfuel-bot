const mongoose = require('mongoose');
const crypto = require('crypto');
const moment = require('moment');

const Schema = new mongoose.Schema(
  {
    sessionToken: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

Schema.statics = {
  /**
   * Generate a refresh token object and saves it into the database
   *
   * @param {User} user
   * @returns {SessionToken}
   */
  generate(user) {
    const sessionToken = `r:${crypto.randomBytes(40).toString('hex')}`;
    const expiresAt = moment().add(30, 'days').toDate();
    const tokenObject = new Session({
      sessionToken,
      user,
      expiresAt,
    });
    tokenObject.save();
    return tokenObject;
  },
};

const Session = mongoose.model('Session', Schema);

module.exports = Session;
