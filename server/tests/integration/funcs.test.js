jest.mock('../../utils/chatfuel.js', () => ({
  getChatbotUsers: jest.fn(),
  getChatbotUser: jest.fn(),
  matchModelPaths: jest.fn(),
}));

const mongoose = require('mongoose');
const request = require('supertest');
const config = require('config');
const httpStatus = require('http-status');
const app = require('../../app');
const cf = require('../../utils/chatfuel');

const People = require('../../models/people.model');
const Reply = require('../../models/reply.model');

afterAll(async () => {
  await mongoose.disconnect();
});

describe('POST /funcs/people', () => {
  beforeEach(async () => {
    await People.deleteMany();
  });

  test('should create a new people', async () => {
    const agent = await request(app)
      .post('/funcs/people')
      .send({
        id: '3922551107771012',
        firstname: 'Makus',
        lastname: 'Yui',
        gender: 'male',
      })
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);
    expect(agent.body).toEqual({
      messages: [{ text: 'Successfully saved the data.' }],
    });

    const doc = await People.findById('3922551107771012');
    expect(doc.firstname).toBe('Makus');
    expect(doc.lastname).toBe('Yui');
    expect(doc.gender).toBe('male');
  });

  test('should create a new people with value null', async () => {
    const agent = await request(app)
      .post('/funcs/people')
      .send({
        id: '3922551107771012',
        firstname: 'null',
        lastname: 'null',
        gender: 'null',
        pic: 'null',
      })
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);
    expect(agent.body).toEqual({
      messages: [{ text: 'Successfully saved the data.' }],
    });

    const doc = await People.findById('3922551107771012');
    expect(doc.firstname).toBeUndefined();
    expect(doc.lastname).toBeUndefined();
    expect(doc.gender).toBeUndefined();
    expect(doc.pic).toBeUndefined();
  });

  test('should update the people if id is exists', async () => {
    let doc = await People.create({
      _id: '3922551107771012',
      firstname: 'Makus',
      lastname: 'Yui',
      gender: 'male',
    });

    const agent = await request(app)
      .post('/funcs/people')
      .send({
        id: doc._id,
        firstname: 'ix',
      })
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);
    expect(agent.body).toEqual({
      messages: [{ text: 'Successfully saved the data.' }],
    });

    doc = await People.findById(doc._id);
    expect(doc.firstname).toBe('ix');
  });

  test('should report error when id is not provided', () => {
    return request(app)
      .post('/funcs/people')
      .send({
        firstname: 'ix',
      })
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST)
      .then((res) => {
        expect(res.body.message).toBe('"id" is required');
      });
  });

  test('should report error when id provided is not valid', () => {
    return request(app)
      .post('/funcs/people')
      .send({
        id: 'abc',
        firstname: 'ix',
      })
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST)
      .then((res) => {
        expect(res.body.message).toBe(
          '"id" with value "abc" fails to match the messenger user id pattern'
        );
      });
  });
});

describe('POST /funcs/reply', () => {
  beforeEach(async () => {
    cf.getChatbotUsers.mockReset();
    cf.getChatbotUser.mockReset();
    cf.matchModelPaths.mockReset();
    await People.deleteMany();
    await Reply.deleteMany();

    await People.create({
      _id: '3922551107771011',
      firstname: 'Sara',
      lastname: 'De',
      gender: 'male',
    });
  });

  test('should create a new reply', async () => {
    const agent = await request(app)
      .post('/funcs/reply')
      .send({
        people: '3922551107771011',
        submittedType: 'button',
        value: 'ok',
        blockId: 'alsdfmlsdfkl',
      })
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);
    expect(agent.body).toEqual({});

    const doc = await Reply.findOne({});
    expect(doc.people).toBe('3922551107771011');
    expect(doc.submittedType).toBe('button');
    expect(doc.value).toBe('ok');
    expect(doc.blockId).toBe('alsdfmlsdfkl');
  });

  test('should create a new people and reply', async () => {
    cf.getChatbotUser.mockImplementation(() => ({
      'messenger user id': '3922551107771012',
      'first name': 'Makus',
      'last name': 'Yui',
      gender: 'male',
    }));

    cf.matchModelPaths.mockImplementation(() => ({
      id: '3922551107771012',
      firstname: 'Makus',
      lastname: 'Yui',
      gender: 'male',
    }));

    const agent = await request(app)
      .post('/funcs/reply')
      .send({
        people: '3922551107771012',
        submittedType: 'button',
        value: 'ok',
        blockId: 'alsdfmlsdfkl',
      })
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);
    expect(agent.body).toEqual({});

    const people = await People.findById('3922551107771012');
    expect(people.firstname).toBe('Makus');
    expect(people.lastname).toBe('Yui');
    expect(people.gender).toBe('male');

    const reply = await Reply.findOne({});
    expect(reply.people).toBe('3922551107771012');
    expect(reply.submittedType).toBe('button');
    expect(reply.value).toBe('ok');
    expect(reply.blockId).toBe('alsdfmlsdfkl');
  });

  test('should report error when people is not provided', () => {
    cf.getChatbotUser.mockImplementation(() => undefined);

    return request(app)
      .post('/funcs/reply')
      .send({
        submittedType: 'button',
        value: 'ok',
        blockId: 'alsdfmlsdfkl',
      })
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST)
      .then((res) => {
        expect(res.body.message).toBe('"people" is required');
      });
  });

  test('should report error when people is not valid', () => {
    cf.getChatbotUser.mockImplementation(() => undefined);

    return request(app)
      .post('/funcs/reply')
      .send({
        people: 'abc',
        submittedType: 'button',
        value: 'ok',
        blockId: 'alsdfmlsdfkl',
      })
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST)
      .then((res) => {
        expect(res.body.message).toBe(
          '"people" with value "abc" fails to match the messenger user id pattern'
        );
      });
  });

  test('should report error when people is not exists', () => {
    cf.getChatbotUser.mockImplementation(() => undefined);

    return request(app)
      .post('/funcs/reply')
      .send({
        people: '3922551107771013',
        submittedType: 'button',
        value: 'ok',
        blockId: 'alsdfmlsdfkl',
      })
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST)
      .then((res) => {
        expect(res.body.message).toBe('"people" is invalid');
      });
  });
});
