const mongoose = require('mongoose');
const request = require('supertest');
const httpStatus = require('http-status');

const app = require('../../app');
const SessionToken = require('../../app/models/sessionToken');
const User = require('../../app/models/user');

let dbUser;
// eslint-disable-next-line no-unused-vars
let user;

beforeEach(async () => {
  dbUser = {
    email: 'branstark@gmail.com',
    password: 'mypassword',
    name: 'Bran Stark',
    role: 'admin'
  };

  user = {
    email: 'sousa.dfs@gmail.com',
    password: '123456',
    name: 'Daniel Sousa'
  };

  await User.deleteMany({});
  await SessionToken.deleteMany({});

  await User.create(dbUser);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('POST /auth/login', () => {
  it('should return an accessToken and a refreshToken when email and password matches', async () => {
    const agent = await request(app)
      .post('/auth/login')
      .send(dbUser)
      .expect(httpStatus.OK);

    delete dbUser.password;

    expect(agent.body).toHaveProperty('sessionToken');
    expect(agent.body.email).toBe(dbUser.email);
    expect(agent.body.name).toBe(dbUser.name);
    expect(agent.body).toHaveProperty('sessionToken');
  });

  it('should report error when email and password are not provided', async () => {
    const agent = await request(app)
      .post('/auth/login')
      .send({})
      .expect(httpStatus.BAD_REQUEST);

    expect(agent.body.errors).toEqual([
      {
        field: 'email',
        location: 'body',
        message: 'Is required'
      },
      {
        field: 'password',
        location: 'body',
        message: 'Is required'
      }
    ]);
  });

  it('should report error when the email provided is not valid', async () => {
    dbUser.email = 'this_is_not_an_email';

    const agent = await request(app)
      .post('/auth/login')
      .send(dbUser)
      .expect(httpStatus.BAD_REQUEST);

    const errors = agent.body.errors[0];
    expect(errors.field).toBe('email');
    expect(errors.location).toBe('body');
    expect(errors.message).toBe('Must be a valid email');
  });

  it("should report error when email and password don't match", async () => {
    dbUser.password = 'xxx';
    const agent = await request(app)
      .post('/auth/login')
      .send(dbUser)
      .expect(httpStatus.UNAUTHORIZED);

    const { code, message } = agent.body;
    expect(code).toBe(401);
    expect(message).toBe('Incorrect email or password');
  });
});

describe('POST /auth/logout', () => {
  it('should delete the session token the user', async () => {
    const user = await User.findOne({ email: dbUser.email });
    const sessionToken = SessionToken.generate(user).token;

    const agent = await request(app)
      .post('/auth/logout')
      .set('Authorization', sessionToken)
      .expect(httpStatus.NO_CONTENT);

    expect(agent.body).toEqual({});
    await expect(
      SessionToken.findOne({ token: sessionToken })
    ).resolves.toBeNull();
  });
});
