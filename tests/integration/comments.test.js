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
const Question = require('../../app/models/question');
const Comment = require('../../app/models/comment');

mongoose.Promise = global.Promise;

let sessionToken;
let dbPeoples;
let dbSchedules;
let dbQuestions;
let dbComments;
let comment;

beforeEach(async () => {
  await User.deleteMany({});
  await SessionToken.deleteMany({});
  await People.deleteMany({});
  await Schedule.deleteMany({});
  await Comment.deleteMany({});

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

  const savedQuestion = await Question.create([
    {
      name: 'a',
      schedule: dbSchedules[0]._id,
      type: 3
    },
    {
      name: 'b',
      schedule: dbSchedules[0]._id,
      type: 3
    }
  ]);

  dbQuestions = docToJSON(savedQuestion);

  const savedComments = await Comment.insertMany([
    {
      people: dbPeoples[0]._id,
      question: dbQuestions[0]._id,
      answer: 'good'
    }
  ]);
  dbComments = docToJSON(savedComments);

  comment = {
    people: dbPeoples[0]._id,
    question: dbQuestions[1]._id,
    answer: 'good'
  };
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('GET /comments', () => {
  test('should get all comment', async () => {
    const agent = await request(app)
      .get('/comments')
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(agent.body.results).toEqual(dbComments);
  });

  test('should get count', async () => {
    const agent = await request(app)
      .get('/comments')
      .query({ count: 1, limit: 0 })
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(agent.body.results).toEqual([]);
    expect(agent.body.count).toBe(dbComments.length);
  });
});

describe('POST /comments', () => {
  test('should create a new comment', async () => {
    const agent = await request(app)
      .post('/comments')
      .set('Authorization', sessionToken)
      .send(comment)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.CREATED);

    const result = await Comment.findById(agent.body._id);
    expect(agent.body).toEqual(docToJSON(result));
  });
});

describe('GET /comments/:id', () => {
  test('should get the comment', async () => {
    const object = dbComments[0];

    const agent = await request(app)
      .get(`/comments/${object._id}`)
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    expect(agent.body).toEqual(object);
  });

  test('should report error when comments does not exists', async () => {
    const id = mongoose.Types.ObjectId();

    const agent = await request(app)
      .get(`/comments/${id}`)
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.NOT_FOUND);
    expect(agent.body.code).toBe(404);
    expect(agent.body.message).toBe('Object not found.');
  });
});

describe('PUT /comments', () => {
  test('should update the comment', async () => {
    const object = dbComments[0];

    const agent = await request(app)
      .put(`/comments/${object._id}`)
      .send(comment)
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    const result = await Comment.findById(object._id);
    expect(agent.body).toEqual(docToJSON(result));
  });

  test('should report error when comments does not exists', async () => {
    const id = mongoose.Types.ObjectId();

    const agent = await request(app)
      .put(`/comments/${id}`)
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.NOT_FOUND);
    expect(agent.body.code).toBe(404);
    expect(agent.body.message).toBe('Object not found.');
  });
});

describe('DELETE /comments', () => {
  test('should delete the comment', async () => {
    const id = dbComments[0]._id;

    const agent = await request(app)
      .delete(`/comments/${id}`)
      .set('Authorization', sessionToken)
      .expect(httpStatus.NO_CONTENT);
    expect(agent.body).toEqual({});
    await expect(Comment.findById(id)).resolves.toBeNull();
  });

  test('should report error when comments does not exists', async () => {
    const id = mongoose.Types.ObjectId();

    const agent = await request(app)
      .delete(`/comments/${id}`)
      .set('Authorization', sessionToken)
      .expect(httpStatus.NOT_FOUND);
    expect(agent.body.code).toBe(404);
    expect(agent.body.message).toBe('Object not found.');
  });
});
