const mongoose = require('mongoose');
const httpStatus = require('http-status');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const docToJSON = require('../docToJSON');

const app = require('../../app');
const User = require('../../app/models/user');
const SessionToken = require('../../app/models/sessionToken');
const Schedule = require('../../app/models/schedule');

mongoose.Promise = global.Promise;

let sessionToken;
let dbSchedules;
let schedule;

beforeEach(async () => {
  await User.deleteMany({});
  await SessionToken.deleteMany({});
  await Schedule.deleteMany({});

  const passwordHashed = await bcrypt.hash('1234', 1);
  const savedUser = await User.create({
    email: 'jonsnow@gmail.com',
    password: passwordHashed,
    username: 'Jon Snow',
    role: 'admin'
  });
  sessionToken = SessionToken.generate(savedUser).token;

  schedule = { name: 'Day 3' };

  const savedSchedules = await Schedule.insertMany([
    {
      name: 'Day 1'
    },
    {
      name: 'Day 2'
    }
  ]);
  dbSchedules = docToJSON(savedSchedules);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('GET /schedules', () => {
  test('should get all schedules', async () => {
    const agent = await request(app)
      .get('/schedules')
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);
    expect(agent.body.results).toEqual(dbSchedules);
  });

  test('should get count', async () => {
    const agent = await request(app)
      .get('/schedules')
      .query({ count: 1, limit: 0 })
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);
    expect(agent.body.count).toBe(dbSchedules.length);
    expect(agent.body.results).toEqual([]);
  });
});

describe('POST /schedules', () => {
  test('should create a new schedule', async () => {
    const agent = await request(app)
      .post('/schedules')
      .send(schedule)
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.CREATED);

    const result = await Schedule.findById(agent.body._id);
    expect(agent.body).toEqual(docToJSON(result));
  });
});

describe('GET /schedules/:id', () => {
  test('should get the schedule', async () => {
    const object = dbSchedules[0];

    const agent = await request(app)
      .get(`/schedules/${object._id}`)
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    expect(agent.body).toEqual(object);
  });

  test('should report error when schedules does not exists', async () => {
    const id = mongoose.Types.ObjectId();

    const agent = await request(app)
      .get(`/schedules/${id}`)
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.NOT_FOUND);
    expect(agent.body.code).toBe(404);
    expect(agent.body.message).toBe('Object not found.');
  });
});

describe('PUT /schedules', () => {
  test('should update the schedule', async () => {
    const id = dbSchedules[0]._id;

    const agent = await request(app)
      .put(`/schedules/${id}`)
      .send(schedule)
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    const result = await Schedule.findById(id);
    expect(agent.body).toEqual(docToJSON(result));
  });

  test.todo('add should update and change "dbReplies" the schedule');

  test('should report error when schedules does not exists', async () => {
    const id = mongoose.Types.ObjectId();

    const agent = await request(app)
      .put(`/schedules/${id}`)
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.NOT_FOUND);
    expect(agent.body.code).toBe(404);
    expect(agent.body.message).toBe('Object not found.');
  });
});

describe('DELETE /schedules', () => {
  test('should delete the schedule', async () => {
    const id = dbSchedules[0]._id;

    const agent = await request(app)
      .delete(`/schedules/${id}`)
      .set('Authorization', sessionToken)
      .expect(httpStatus.NO_CONTENT);
    expect(agent.body).toEqual({});
    await expect(Schedule.findById(dbSchedules[0]._id)).resolves.toBeNull();
  });

  test('should report error when schedules does not exists', async () => {
    const id = mongoose.Types.ObjectId();

    const agent = await request(app)
      .delete(`/schedules/${id}`)
      .set('Authorization', sessionToken)
      .expect(httpStatus.NOT_FOUND);
    expect(agent.body.code).toBe(404);
    expect(agent.body.message).toBe('Object not found.');
  });
});
