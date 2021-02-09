const mongoose = require('mongoose');
const crypto = require('crypto');
const chatfuel = require('../utils/chatfuel');
const schemaQuery = require('../utils/schemaQuery');

const PeopleSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      trim: true,
      default: () => crypto.randomBytes(8).toString('hex')
    },
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    gender: {
      type: String,
      trim: true
    },
    pic: {
      type: String,
      trim: true
    },
    province: {
      type: String,
      trim: true
    },
    district: {
      type: String,
      trim: true
    },
    dentalId: {
      type: String,
      trim: true,
      index: true
    },
    childName: {
      type: String,
      trim: true
    },
    childBirthday: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

PeopleSchema.static('getAndFetch', async function(id) {
  if (!id) {
    throw new mongoose.Error('parame is required');
  }

  const people = await this.findById(id);
  if (people) {
    return people;
  }

  const chatfuelUser = await chatfuel.getUser(id);
  if (!chatfuelUser) {
    return;
  }

  // create a new people
  const object = {
    _id: chatfuelUser.messengerUserId,
    firstName: chatfuelUser.firstName,
    lastName: chatfuelUser.lastName,
    gender: chatfuelUser.gender,
    pic: chatfuelUser.profilePicUrl,
    province: chatfuelUser.province,
    district: chatfuelUser.district,
    childName: chatfuelUser.name,
    childBirthday: chatfuelUser.year
  };

  this.create(object);
  return object;
});

PeopleSchema.query = schemaQuery;

module.exports = mongoose.model('People', PeopleSchema);
