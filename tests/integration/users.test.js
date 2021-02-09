const request = require('supertest');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const docToJSON = require('../docToJSON');
const app = require('../../app');

const User = require('../../app/models/user');
const SessionToken = require('../../app/models/sessionToken');

let sessionToken;
let dbUsers;
let admin;
let password = '123456';

beforeEach(async () => {
  await User.deleteMany({});
  await SessionToken.deleteMany({});

  const passwordHashed = await bcrypt.hash(password, 1);

  admin = {
    email: 'sousa.dfs@gmail.com',
    password,
    name: 'Daniel Sousa'
  };

  const savedUsers = await User.insertMany([
    {
      email: 'jonsnow@gmail.com',
      password: passwordHashed,
      name: 'Jon Snow',
      role: 'admin'
    },
    {
      email: 'branstark@gmail.com',
      password: passwordHashed,
      name: 'Bran Stark',
      role: 'admin'
    }
  ]);
  dbUsers = docToJSON(savedUsers);
  sessionToken = SessionToken.generate(dbUsers[0]).token;
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('GET /users', () => {
  test('should get all users', async () => {
    const agent = await request(app)
      .get('/users')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    expect(agent.body.results).toEqual(dbUsers);
  });

  test('should get count users', async () => {
    const agent = await request(app)
      .get('/users')
      .query({ count: 1, limit: 0 })
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);
    expect(agent.body.count).toBe(dbUsers.length);
    expect(agent.body.results).toEqual([]);
  });

  test('should get users with param "where"', async () => {
    const agent = await request(app)
      .get('/users')
      .query({ where: JSON.stringify({ email: dbUsers[0].email }) })
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);
    expect(agent.body.results).toEqual([dbUsers[0]]);
  });
});

describe('GET /users/me', () => {
  test("should get the logged user's info", async () => {
    const agent = await request(app)
      .get('/users/me')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    expect(agent.body).toEqual(dbUsers[0]);
  });

  test('should report error without stacktrace when accessToken is expired', async () => {
    const expiresToken = moment()
      .subtract(1, 'days')
      .toDate();
    await new Promise(resolve => setTimeout(resolve, 500));
    await SessionToken.findOneAndUpdate(
      { token: sessionToken },
      { expiresAt: expiresToken }
    );

    const agent = await request(app)
      .get('/users/me')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.UNAUTHORIZED);

    expect(agent.body.code).toBe(401);
    expect(agent.body.message).toBe('Session token expired.');
  });
});

describe('POST /users', () => {
  test('should create a new user', async () => {
    const agent = await request(app)
      .post('/users')
      .send(admin)
      .set('Authorization', sessionToken)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.CREATED);

    delete admin.password;

    expect(agent.body).toMatchObject(admin);
  });
});

describe('GET /users/:id', () => {
  test('should get the user', async () => {
    const id = dbUsers[0]._id;

    const agent = await request(app)
      .get(`/users/${id}`)
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);
    expect(agent.body).toMatchObject(dbUsers[0]);
  });

  test('should resport error when user does not exists', async () => {
    const id = mongoose.Types.ObjectId();

    const agent = await request(app)
      .get(`/users/${id}`)
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.NOT_FOUND);
    expect(agent.body.code).toBe(404);
    expect(agent.body.message).toBe('Object not found.');
  });
});

describe('PUT /users/:id', () => {
  test('should update the user', async () => {
    const id = dbUsers[0]._id;
    delete admin.password;

    const agent = await request(app)
      .put(`/users/${id}`)
      .send(admin)
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    expect(agent.body._id).toBe(id);
    expect(agent.body).toMatchObject(admin);
  });

  test('should update password the user', async () => {
    const object = dbUsers[0];
    await Promise.all([
      SessionToken.generate(object),
      SessionToken.generate(object),
      SessionToken.generate(object)
    ]);

    const agent = await request(app)
      .put(`/users/${object._id}`)
      .send({ password: admin.password })
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    const user = await User.findOne({ email: agent.body.email });
    await expect(user.passwordMatches(admin.password)).resolves.toBe(true);
    await expect(SessionToken.find({ user })).resolves.toHaveLength(0);
  });

  test('should clean session when set password', async () => {
    const object = await User.findOne();
    await Promise.all([
      SessionToken.generate(object),
      SessionToken.generate(object),
      SessionToken.generate(object)
    ]);

    const agent = await request(app)
      .put(`/users/${object._id}`)
      .send({ password: password })
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    expect(agent.body).toEqual(docToJSON(object.transform()));

    const user = await User.findOne({ email: agent.body.email });
    await expect(user.passwordMatches(password)).resolves.toBe(true);
    await expect(SessionToken.find({ user })).resolves.toHaveLength(0);
  });

  test('should resport error when user does not exists', async () => {
    const id = mongoose.Types.ObjectId();

    const agent = await request(app)
      .put(`/users/${id}`)
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.NOT_FOUND);
    expect(agent.body.code).toBe(404);
    expect(agent.body.message).toBe('Object not found.');
  });
});

describe('DELETE /users/:id', () => {
  test('should delete the user', async () => {
    const id = dbUsers[0]._id;

    const agent = await request(app)
      .delete(`/users/${id}`)
      .set('Authorization', sessionToken)
      .expect(httpStatus.NO_CONTENT);
    expect(agent.body).toEqual({});
    await expect(User.findById(dbUsers[0]._id)).resolves.toBeNull();
  });

  test('should resport error when user does not exists', async () => {
    const id = mongoose.Types.ObjectId();

    const agent = await request(app)
      .delete(`/users/${id}`)
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.NOT_FOUND);
    expect(agent.body.code).toBe(404);
    expect(agent.body.message).toBe('Object not found.');
  });
});
