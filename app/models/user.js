const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
const schemaQuery = require('../utils/schemaQuery');

/**
 * User Roles
 */
const roles = ['admin'];

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 128
    },
    name: {
      type: String,
      maxlength: 128,
      index: true,
      trim: true
    },
    role: {
      type: String,
      enum: roles,
      default: 'admin'
    },
    pic: {
      type: String,
      trim: true
    }
  },
  {
    toJSON: {
      versionKey: false,
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.role;
        return ret;
      }
    }
  }
);

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
UserSchema.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) return next();

    const rounds = process.env.NODE_ENV === 'test' ? 1 : 10;

    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
UserSchema.method({
  transform() {
    const transformed = {};
    const fields = ['_id', 'name', 'email'];

    fields.forEach(field => {
      transformed[field] = this[field];
    });

    return transformed;
  },
  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  }
});

/**
 * Statics
 */
UserSchema.statics = {
  roles,

  /**
   * Return new validation error
   * if error is a mongoose duplicate key error
   *
   * @param {Error} error
   * @returns {Error|APIError}
   */
  checkDuplicateEmail(error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return new APIError({
        message: 'Validation Error',
        errors: [
          {
            field: 'email',
            location: 'body',
            message: 'already exists'
          }
        ],
        status: httpStatus.CONFLICT,
        stack: error.stack
      });
    }
    return error;
  }
};

UserSchema.query = schemaQuery;

module.exports = mongoose.model('User', UserSchema);
