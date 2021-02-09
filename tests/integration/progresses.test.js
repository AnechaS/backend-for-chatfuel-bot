const mongoose = require('mongoose');
const request = require('supertest');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const docToJSON = require('../docToJSON');

const app = require('../../app');
const User = require('../../app/models/user');
const SessionToken = require('../../app/models/sessionToken');
const People = require('../../app/models/people');
const Schedule = require('../../app/models/schedule');
const Progress = require('../../app/models/progress');

mongoose.Promise = global.Promise;

let sessionToken;
let dbPeoples;
let dbSchedules;
let dbProgresses;
let progress;

beforeEach(async () => {
  await User.deleteMany({});
  await SessionToken.deleteMany({});
  await People.deleteMany({});
  await Schedule.deleteMany({});
  await Progress.deleteMany({});

  const passwordHashed = await bcrypt.hash('1234', 1);
  const dbUser = {
    email: 'jonsnow@gmail.com',
    password: passwordHashed,
    username: 'Jon Snow'
  };

  const savedUser = await User.create(dbUser);
  sessionToken = SessionToken.generate(savedUser).token;

  const savedPeoples = await People.create([
    {
      firstName: 'Krillin',
      lastName: '',
      province: 'สงขลา',
      district: 'เทพา',
      dentalId: 'x',
      childName: 'Marron',
      childBirthday: '2560',
      gender: 'male'
    },
    {
      firstName: 'Son',
      lastName: 'Goku',
      province: 'ยะลา',
      district: 'เมือง',
      dentalId: '5976438',
      childName: 'Gohan',
      childBirthday: '2560',
      gender: 'male'
    }
  ]);
  dbPeoples = docToJSON(savedPeoples);

  const savedSchedules = await Schedule.create([
    {
      name: 'Day 1'
    },
    {
      name: 'Day 2'
    }
  ]);
  dbSchedules = docToJSON(savedSchedules);

  const savedProgress = await Progress.insertMany([
    {
      people: dbPeoples[0]._id,
      schedule: dbSchedules[0]._id,
      status: 2
    },
    {
      people: dbPeoples[1]._id,
      schedule: dbSchedules[0]._id,
      status: 1
    }
  ]);
  dbProgresses = docToJSON(savedProgress);

  progress = {
    people: dbPeoples[0]._id,
    schedule: dbSchedules[1]._id,
    status: 1
  };
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('GET /progresses', () => {
  test('should get all progress', async () => {
    const agent = await request(app)
      .get('/progresses')
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(agent.body.results).toEqual(dbProgresses);
  });

  test('should get count', async () => {
    const agent = await request(app)
      .get('/progresses')
      .query({ count: 1, limit: 0 })
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(agent.body.results).toEqual([]);
    expect(agent.body.count).toBe(dbProgresses.length);
  });
});

describe('POST /progresses', () => {
  test('should reate a new progress', async () => {
    const agent = await request(app)
      .post('/progresses')
      .set('Authorization', sessionToken)
      .send(progress)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.CREATED);

    const result = await Progress.findById(agent.body._id);
    expect(agent.body).toEqual(docToJSON(result));
  });
});

describe('GET /progresses/:id', () => {
  test('should get the progress', async () => {
    const object = dbProgresses[0];

    const agent = await request(app)
      .get(`/progresses/${object._id}`)
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    expect(agent.body).toEqual(object);
  });

  test('should report error when progress does not exists', async () => {
    const id = mongoose.Types.ObjectId();

    const agent = await request(app)
      .get(`/progresses/${id}`)
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.NOT_FOUND);
    expect(agent.body.code).toBe(404);
    expect(agent.body.message).toBe('Object not found.');
  });
});

describe('PUT /progresses', () => {
  test('should update the progress', async () => {
    const object = dbProgresses[0];

    const agent = await request(app)
      .put(`/progresses/${object._id}`)
      .send(progress)
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    const result = await Progress.findById(object._id);
    expect(agent.body).toEqual(docToJSON(result));
  });

  test('should report error when id does not exists', async () => {
    const id = mongoose.Types.ObjectId();

    const agent = await request(app)
      .put(`/progresses/${id}`)
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.NOT_FOUND);
    expect(agent.body.code).toBe(404);
    expect(agent.body.message).toBe('Object not found.');
  });
});

describe('DELETE /progresses', () => {
  test('should delete the progress', async () => {
    const object = dbProgresses[0];

    const agent = await request(app)
      .delete(`/progresses/${object._id}`)
      .set('Authorization', sessionToken)
      .expect(httpStatus.NO_CONTENT);
    expect(agent.body).toEqual({});
    await expect(Progress.findById(object._id)).resolves.toBeNull();
  });

  test('should report error when progresses does not exists', async () => {
    const id = mongoose.Types.ObjectId();

    const agent = await request(app)
      .delete(`/progresses/${id}`)
      .set('Authorization', sessionToken)
      .expect(httpStatus.NOT_FOUND);
    expect(agent.body.code).toBe(404);
    expect(agent.body.message).toBe('Object not found.');
  });
});
