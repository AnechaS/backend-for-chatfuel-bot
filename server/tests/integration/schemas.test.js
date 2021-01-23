const httpStatus = require('http-status');
const mongoose = require('mongoose');
const request = require('supertest');
const config = require('config');
const app = require('../../app');

let sessionToken;

const User = mongoose.models.User;
const Session = mongoose.models.Session;

beforeEach(async () => {
  await User.deleteMany({});
  await Session.deleteMany({});

  const user = await User.create({
    email: 'admin@email.com',
    password: '123456',
    name: 'Admin',
    role: 'admin',
  });
  sessionToken = await Session.generate(user).sessionToken;
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('GET /schemas', () => {
  test('should get schemas', () => {
    return request(app)
      .get('/schemas')
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK)
      .then((res) => {
        Object.keys(mongoose.models).forEach((modelName, i) => {
          expect(res.body.results[i].className).toBe(modelName);
        });
      });
  });
});

describe('GET /schemas/:modelName', () => {
  test('should get schema', () => {
    return request(app)
      .get('/schemas/User')
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.className).toBe('User');
      });
  });
});
