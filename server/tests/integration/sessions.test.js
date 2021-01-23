const request = require('supertest');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const config = require('config');
const app = require('../../app');

const User = mongoose.models.User;
const Session = mongoose.models.Session;

let sessionToken = '';

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

describe('GET /classes/Session', () => {
  test('should error not found', () => {
    return request(app)
      .get('/classes/Session')
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect(httpStatus.NOT_FOUND);
  });

  test.todo('should get sessions');
  test.todo('should get sessions when role admin');
  test.todo('should get sessions of the user when role readWrite and read');
});

describe('POST /classes/Session', () => {
  test('should error not found', () => {
    return request(app)
      .post('/classes/Session')
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect(httpStatus.NOT_FOUND);
  });

  test.todo('should create session with role admin');
  test.todo('should create session with token when role readWrite and read');
});

describe('GET /classes/Session/:id', () => {
  test('should error not found', () => {
    return request(app)
      .get('/classes/Session/abcdef')
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect(httpStatus.NOT_FOUND);
  });

  test.todo('should update session');
});

// describe('GET /sessions/me', () => {
//   test.todo('should get session with token')
// })

// describe('PUT /sessions/me', () => {
//   test.todo('should update session with token')
// })

describe('PUT /classes/Session/:id', () => {
  test('should error not found', () => {
    return request(app)
      .put('/classes/Session/abcdef')
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect(httpStatus.NOT_FOUND);
  });

  test.todo('should update session');
});

describe('DELETE /classes/Session/:id', () => {
  test('should error not found', () => {
    return request(app)
      .delete('/classes/Session/abcdef')
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect(httpStatus.NOT_FOUND);
  });

  test.todo('should delete session');
});
