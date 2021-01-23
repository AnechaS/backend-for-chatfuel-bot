jest.mock('node-fetch');

const request = require('supertest');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const config = require('config');
const fetch = require('node-fetch');
const app = require('../../app');

const { Response } = jest.requireActual('node-fetch');

const User = mongoose.models.User;
const Session = mongoose.models.Session;

let sessionToken;

afterAll(async () => {
  await mongoose.disconnect();
});

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

afterEach(() => {
  fetch.mockReset();
});

describe('GET /stats/totalChatbotUsers', () => {
  test('should get stats total chatbot users', () => {
    fetch.mockResolvedValue(
      new Response(
        JSON.stringify({
          result: {
            x: ['2020-11-23', '2020-11-24'],
            y: {
              'Total New users': [0, 0],
              'New Blocked users': [0, 0],
              'Total users': [49, 50],
              'Blocked users': [17, 17],
            },
          },
          success: true,
        })
      )
    );

    return request(app)
      .get('/stats/totalChatbotUsers')
      .set('X-API-Key', config.get('apiKey'))
      .set('X-Session-Token', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK, {
        x: ['2020-11-23', '2020-11-24'],
        y: {
          'Total New users': [0, 0],
          'New Blocked users': [0, 0],
          'Total users': [49, 50],
          'Blocked users': [17, 17],
        },
      });
  });

  test('should report error when failure request chatfuel data', () => {
    fetch.mockResolvedValue(
      new Response(
        JSON.stringify({
          result: {},
          success: false,
        }),
        { status: 400 }
      )
    );

    return request(app)
      .get('/stats/totalChatbotUsers')
      .set('X-API-Key', config.get('apiKey'))
      .set('X-Session-Token', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.SERVICE_UNAVAILABLE);
  });
});
