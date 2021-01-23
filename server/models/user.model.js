const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

/**
 * User Roles
 */
const roles = ['admin', 'readWrite', 'read'];

const Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
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
      default: 'readWrite'
    },
    pic: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
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

Schema.pre('save', async function save(next) {
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
Schema.method({
  transform() {
    const transformed = {};
    const fields = ['_id', 'name', 'email', 'pic'];

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
Schema.statics = {
  roles,
};

Schema.plugin(uniqueValidator);

module.exports = mongoose.model('User', Schema);
