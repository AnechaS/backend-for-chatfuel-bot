const mongoose = require('mongoose');
const request = require('supertest');
const httpStatus = require('http-status');
const config = require('config');
const app = require('../../app');

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
)
);

const User = mongoose.models.User;
const Session = mongoose.models.Session;
const Person = mongoose.models.Person;

let sessionToken;

beforeEach(async () => {
  await User.deleteMany({});
  await Session.deleteMany({});
  await Person.deleteMany({});

  const user = await User.create({
    email: 'admin@email.com',
    password: '123456',
    name: 'Admin',
    role: 'admin',
  });
  sessionToken = await Session.generate(user).sessionToken;

  /* const persons = */ await Person.insertMany([
    {
      name: 'Goku',
      power: 10,
    },
    {
      name: 'Krillin',
      power: 5,
    },
  ]);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('DELETE /purge/:modelName/', () => {
  test('should delete all document', async () => {
    await request(app)
      .delete('/purge/Person')
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect(httpStatus.NO_CONTENT);

    await expect(Person.find()).resolves.toHaveLength(0);
  });

  test('should report error class not match', () => {
    return request(app)
      .get('/purge/Test')
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect(httpStatus.NOT_FOUND);
  });
});
