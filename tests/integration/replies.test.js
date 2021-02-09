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
const Reply = require('../../app/models/reply');

mongoose.Promise = global.Promise;

let sessionToken;
let dbPeoples;
let dbSchedules;
let dbReplies;
let reply;

const blockIds = ['zxcvbnm', 'qwertyu'];

beforeEach(async () => {
  await User.deleteMany({});
  await SessionToken.deleteMany({});
  await People.deleteMany({});
  await Schedule.deleteMany({});
  await Reply.deleteMany({});

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

  const savedReplys = await Reply.insertMany([
    {
      people: dbPeoples[0]._id,
      schedule: dbSchedules[0]._id,
      text: 'Hello',
      blockId: blockIds[0]
    },
    {
      people: dbPeoples[1]._id,
      schedule: dbSchedules[0]._id,
      text: 'Hello',
      blockId: blockIds[0]
    }
  ]);
  dbReplies = docToJSON(savedReplys);

  reply = {
    people: dbPeoples[0]._id,
    schedule: dbSchedules[1]._id,
    text: 'abc',
    blockId: blockIds[1]
  };
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('GET /replies', () => {
  test('should get all reply', async () => {
    const agent = await request(app)
      .get('/replies')
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(agent.body.results).toEqual(dbReplies);
  });

  test('should get count', async () => {
    const agent = await request(app)
      .get('/replies')
      .query({ count: 1, limit: 0 })
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(200);
    expect(agent.body.count).toBe(dbReplies.length);
    expect(agent.body.results).toEqual([]);
  });
});

describe('POST /replies', () => {
  test('should reate a new reply', async () => {
    const agent = await request(app)
      .post('/replies')
      .set('Authorization', sessionToken)
      .send(reply)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.CREATED);

    const result = await Reply.findById(agent.body._id);
    expect(agent.body).toEqual(docToJSON(result));
  });
});

describe('GET /replies/:id', () => {
  test('should get the reply', async () => {
    const object = dbReplies[0];

    const agent = await request(app)
      .get(`/replies/${object._id}`)
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    expect(agent.body).toEqual(object);
  });

  test('should report error when id does not exists', async () => {
    const id = mongoose.Types.ObjectId();

    const agent = await request(app)
      .get(`/replies/${id}`)
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.NOT_FOUND);
    expect(agent.body.code).toBe(404);
    expect(agent.body.message).toBe('Object not found.');
  });
});

describe('PUT /replies', () => {
  test('should update the reply', async () => {
    const id = dbReplies[0]._id;

    const agent = await request(app)
      .put(`/replies/${id}`)
      .send(reply)
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    const result = await Reply.findById(id);
    expect(agent.body).toEqual(docToJSON(result));
  });

  test('should report error when replys does not exists', async () => {
    const id = mongoose.Types.ObjectId();

    const agent = await request(app)
      .put(`/replies/${id}`)
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.NOT_FOUND);
    expect(agent.body.code).toBe(404);
    expect(agent.body.message).toBe('Object not found.');
  });
});

describe('DELETE /replies', () => {
  test('should delete the reply', async () => {
    const id = dbReplies[0]._id;

    const agent = await request(app)
      .delete(`/replies/${id}`)
      .set('Authorization', sessionToken)
      .expect(httpStatus.NO_CONTENT);
    expect(agent.body).toEqual({});
    await expect(Reply.findById(id)).resolves.toBeNull();
  });

  test('should report error when replys does not exists', async () => {
    const id = mongoose.Types.ObjectId();

    const agent = await request(app)
      .delete(`/replies/${id}`)
      .set('Authorization', sessionToken)
      .expect(httpStatus.NOT_FOUND);
    expect(agent.body.code).toBe(404);
    expect(agent.body.message).toBe('Object not found.');
  });
});
