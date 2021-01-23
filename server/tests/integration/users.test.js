const request = require('supertest');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const moment = require('moment');
const config = require('config');
const app = require('../../app');

const User = mongoose.models.User;
const Session = mongoose.models.Session;

let sessionToken;

beforeEach(async () => {
  await User.deleteMany({});
  await Session.deleteMany({});

  const users = await User.insertMany([
    {
      email: 'admin@email.com',
      password: '123456',
      name: 'Admin',
      role: 'admin',
    },
    {
      email: 'user@email.com',
      password: '123456',
      name: 'User',
    },
  ]);

  sessionToken = await Session.generate(users[0]).sessionToken;
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('GET /users/me', () => {
  test("should get the logged user's info", () => {
    return request(app)
      .get('/users/me')
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.email).toBe('admin@email.com');
      });
  });

  test('should report error without stacktrace when accessToken is expired', async () => {
    // wait server datebase add document Session
    await new Promise(resolve => setTimeout(resolve, 1000));
    await Session.findOneAndUpdate(
      { sessionToken },
      { expiresAt: moment().subtract(1, 'days').toDate() }
    );

    return request(app)
      .get('/users/me')
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.UNAUTHORIZED)
      .then((res) => {
        expect(res.body.code).toBe(httpStatus.UNAUTHORIZED);
        expect(res.body.message).toBe('Session token expired.');
      });
  });
});

describe('GET /users', () => {
  test('should get users', () => {
    return request(app)
      .get('/users')
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.results[0].email).toBe('admin@email.com');
        expect(res.body.results[1].email).toBe('user@email.com');
      });
  });

  test('should filter users', () => {
    return request(app)
      .get('/users')
      .query({ where: JSON.stringify({ name: 'User' }) })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.results[0].email).toBe('user@email.com');
      });
  });

  test('should count users', () => {
    return request(app)
      .get('/users')
      .query({ count: '1' })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.results[0].email).toBe('admin@email.com');
        expect(res.body.results[1].email).toBe('user@email.com');
        expect(res.body.count).toBe(2);
      });
  });

  test('should count with query', () => {
    return request(app)
      .get('/users')
      .query({
        count: '1',
        limit: 0,
        where: JSON.stringify({ name: 'User' }),
      })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.count).toBe(1);
        expect(res.body.results).toEqual([]);
      });
  });
});

describe('POST /users', () => {
  test('should create a new user', () => {
    return request(app)
      .post('/users')
      .send({
        email: 'bb@email.com',
        name: 'bb',
        password: '123456',
      })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.CREATED)
      .expect((res) => {
        expect(res.body.email).toBe('bb@email.com');
        expect(res.body.password).toBeUndefined();
      });
  });

  test('should error when email and password are not provided', () => {
    return request(app)
      .post('/users')
      .send({
        password: '123456',
      })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST)
      .expect((res) => {
        expect(res.body.message).toBe('"email" is required');
      });
  });

  test('should error when email is not provided', () => {
    return request(app)
      .post('/users')
      .send({
        password: '123456',
      })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST)
      .expect((res) => {
        expect(res.body.message).toBe('"email" is required');
      });
  });

  test('should error when email provided is not valid', () => {
    return request(app)
      .post('/users')
      .send({
        email: 'bb',
        password: '123456',
      })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST)
      .expect((res) => {
        expect(res.body.message).toBe('"email" format is invalid');
      });
  });

  test('should error when duplicate email', () => {
    return request(app)
      .post('/users')
      .send({
        email: 'user@email.com',
        password: '123456',
      })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST)
      .expect((res) => {
        expect(res.body.message).toBe('"email" is already exists');
      });
  });

  test('should error when password is not provided', () => {
    return request(app)
      .post('/users')
      .send({
        email: 'bb@email.com',
      })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST)
      .expect((res) => {
        expect(res.body.message).toBe('"password" is required');
      });
  });
});

describe('GET /users/:id', () => {
  test('should get user', async () => {
    const obj = await User.findOne({});
    return request(app)
      .get(`/users/${obj._id}`)
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.email).toBe(obj.email);
      });
  });
});

describe('PUT /users/:id', () => {
  test('should update user', async () => {
    const obj = await User.findOne({});
    return request(app)
      .put(`/users/${obj._id}`)
      .send({ name: 'bb' })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.email).toBe(obj.email);
        expect(res.body.name).toBe('bb');
      });
  });

  test.todo('should update user and remove sessions');

  test('should error when invalid value', async () => {
    const obj = await User.findOne({});
    return request(app)
      .put(`/users/${obj._id}`)
      .send({ email: 'bb' })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST)
      .then((res) => {
        expect(res.body.message).toBe('"email" format is invalid');
      });
  });

  test('should error when duplicate email', async () => {
    const obj = await User.findOne({});
    return request(app)
      .put(`/users/${obj._id}`)
      .send({ email: 'user@email.com' })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST)
      .then((res) => {
        expect(res.body.message).toBe('"email" is already exists');
      });
  });
});

describe('DELETE /users/:id', () => {
  test('should delete user', async () => {
    const obj = await User.findOne({});
    await request(app)
      .delete(`/users/${obj._id}`)
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect(httpStatus.NO_CONTENT);

    await expect(User.findById(obj._id)).resolves.toBeNull();
  });
});
