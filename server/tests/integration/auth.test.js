const mongoose = require('mongoose');
const request = require('supertest');
const httpStatus = require('http-status');
const config = require('config');
const app = require('../../app');

const Session = require('../../models/session.model');
const User = require('../../models/user.model');

beforeEach(async () => {
  await User.deleteMany({});
  await Session.deleteMany({});

  await User.create({
    email: 'admin@email.com',
    password: '123456',
    name: 'Admin',
    role: 'admin',
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('POST /login', () => {
  test('should return token when email and password matches', () => {
    return request(app)
      .post('/login')
      .send({
        email: 'admin@email.com',
        password: '123456',
      })
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.email).toBe('admin@email.com');
        expect(res.body.name).toBe('Admin');
        expect(res.body.sessionToken).toBeDefined();
      });
  });

  test('should report error when email and password are not provided', () => {
    return request(app)
      .post('/login')
      .send({})
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST)
      .then((res) => {
        expect(res.body.message).toEqual('"email" is required');
      });
  });

  test('should report error when the email provided is not valid', () => {
    return request(app)
      .post('/login')
      .send({
        email: 'bb',
        password: '123456',
      })
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST)
      .then((res) => {
        expect(res.body.message).toBe('"email" must be a valid email');
      });
  });

  test("should report error when email and password don't match", () => {
    return request(app)
      .post('/login')
      .send({
        email: 'admin@email.com',
        password: 'abc',
      })
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.UNAUTHORIZED)
      .then((res) => {
        expect(res.body.code).toBe(httpStatus.UNAUTHORIZED);
        expect(res.body.message).toBe('Incorrect email or password');
      });
  });
});

describe('POST /logout', () => {
  test('should delete the session token the user', async () => {
    const user = await User.findOne({});
    const { sessionToken } = await Session.generate(user);

    await request(app)
      .post('/logout')
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect(httpStatus.NO_CONTENT);

    await expect(Session.findOne({ sessionToken })).resolves.toBeNull();
  });
});
