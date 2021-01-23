jest.mock('../../utils/chatfuel.js', () => ({
  getChatbotUsers: jest.fn(),
  getChatbotUser: jest.fn(),
  matchModelPaths: jest.fn(),
}));

const cf = require('../../utils/chatfuel');
const mongoose = require('mongoose');
const request = require('supertest');
const httpStatus = require('http-status');
const config = require('config');
const app = require('../../app');

const User = mongoose.models.User;
const Session = mongoose.models.Session;
const People = mongoose.models.People;

let sessionToken = '';

beforeEach(async () => {
  cf.getChatbotUsers.mockReset();
  cf.getChatbotUser.mockReset();
  cf.matchModelPaths.mockReset();
  await User.deleteMany({});
  await Session.deleteMany({});

  const user = await User.create({
    email: 'admin@email.com',
    password: '123456',
    name: 'Admin',
    role: 'admin',
  });
  sessionToken = await Session.generate(user).sessionToken;

  await People.insertMany([
    {
      firstname: 'Son',
      lastname: 'Goku',
      gender: 'male',
    },
    {
      firstname: 'Son',
      lastname: 'Gohan',
      gender: 'male',
    },
  ]);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('GET /classes/People', () => {
  test('should get peoples', () => {
    return request(app)
      .get('/classes/People')
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.results[0].firstname).toBe('Son');
        expect(res.body.results[0].lastname).toBe('Goku');

        expect(res.body.results[1].firstname).toBe('Son');
        expect(res.body.results[1].lastname).toBe('Gohan');
      });
  });
});

describe('POST /classes/People', () => {
  test('should create people', () => {
    return request(app)
      .post('/classes/People')
      .send({
        _id: '3000108692793786',
        firstname: 'Son',
        lastname: 'Goten',
      })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.CREATED)
      .then((res) => {
        expect(res.body._id).toBe('3000108692793786');
        expect(res.body.firstname).toBe('Son');
        expect(res.body.lastname).toBe('Goten');
      });
  });

  test('should report error when duplicate id', async () => {
    const doc = await People.findOne({});

    return request(app)
      .post('/classes/People')
      .send({
        _id: doc._id,
        firstname: 'Son',
        lastname: 'Goten',
      })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST)
      .then((res) => {
        expect(res.body.message).toBe('"_id" is already exists');
      });
  });
});

describe('GET /classes/People/:id', () => {
  test('should get people', async () => {
    const doc = await People.findOne();
    return request(app)
      .get(`/classes/People/${doc._id}`)
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.firstname).toBe(doc.firstname);
        expect(res.body.lastname).toBe(doc.lastname);
      });
  });

  test('should get or create people', async () => {
    cf.getChatbotUser.mockImplementation(() => ({
      'messenger user id': '3000108692793785',
      'first name': 'Vegeta',
      'last name': 'Saiya',
      gender: 'male',
    }));

    cf.matchModelPaths.mockImplementation(() => ({
      id: '3000108692793785',
      firstname: 'Vegeta',
      lastname: 'Saiya',
      gender: 'male',
    }));

    return request(app)
      .get('/classes/People/3000108692793785')
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body._id).toBe('3000108692793785');
        expect(res.body.firstname).toBe('Vegeta');
        expect(res.body.lastname).toBe('Saiya');
      });
  });
});

describe('PUT /classes/People/:id', () => {
  test('should update people', async () => {
    const doc = await People.findOne();
    return request(app)
      .put(`/classes/People/${doc._id}`)
      .query({ select: 'lastname' })
      .send({ firstname: 'mm' })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.firstname).toBe('mm');
        expect(res.body.lastname).toBe(doc.lastname);
      });
  });
});

describe('DELETE /classes/People/:id', () => {
  test('should update people', async () => {
    const doc = await People.findOne();
    return request(app)
      .delete(`/classes/People/${doc._id}`)
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect(httpStatus.NO_CONTENT);
  });
});
