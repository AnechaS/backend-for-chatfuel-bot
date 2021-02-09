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
const Question = require('../../app/models/question');
const Quiz = require('../../app/models/quiz');

mongoose.Promise = global.Promise;

let sessionToken;
let dbPeoples;
let dbSchedules;
let dbReplys;
let dbQuestions;
let dbQuizzes;
let quiz;

beforeEach(async () => {
  await User.deleteMany({});
  await SessionToken.deleteMany({});
  await People.deleteMany({});
  await Schedule.deleteMany({});
  await Reply.deleteMany({});
  await Question.deleteMany({});
  await Quiz.deleteMany({});

  const blockIds = ['zxcvbnm', 'qwertyu'];

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
      text: 'a',
      type: 'button',
      blockId: blockIds[0]
    },
    {
      people: dbPeoples[1]._id,
      schedule: dbSchedules[0]._id,
      text: 'b',
      type: 'button',
      blockId: blockIds[0]
    },
    {
      people: dbPeoples[0]._id,
      schedule: dbSchedules[1]._id,
      text: 'a',
      type: 'button',
      blockId: blockIds[1]
    }
  ]);
  dbReplys = docToJSON(savedReplys);

  const savedQuestions = await Question.create([
    {
      name: 'a',
      type: 1,
      correctAnswers: [1]
    },
    {
      name: 'b',
      type: 1,
      correctAnswers: [1]
    }
  ]);
  dbQuestions = docToJSON(savedQuestions);

  const savedQuizs = await Quiz.insertMany([
    {
      people: dbPeoples[0]._id,
      schedule: dbSchedules[0]._id,
      reply: dbReplys[0]._id,
      question: dbQuestions[0]._id,
      answer: 1,
      isCorrect: true
    },
    {
      people: dbPeoples[1]._id,
      schedule: dbSchedules[0]._id,
      reply: dbReplys[0]._id,
      question: dbQuestions[0]._id,
      answer: 2,
      isCorrect: false
    }
  ]);
  dbQuizzes = docToJSON(savedQuizs);

  quiz = {
    people: dbPeoples[0]._id,
    schedule: dbSchedules[1]._id,
    reply: dbReplys[1]._id,
    question: dbQuestions[1]._id,
    answer: 1,
    isCorrect: true
  };
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('GET /quizzes', () => {
  test('should get all quiz', async () => {
    const agent = await request(app)
      .get('/quizzes')
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(agent.body.results).toEqual(dbQuizzes);
  });

  test('should get quiz count', async () => {
    const agent = await request(app)
      .get('/quizzes')
      .query({ count: 1, limit: 0 })
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(agent.body.count).toBe(dbQuizzes.length);
    expect(agent.body.results).toEqual([]);
  });

  test('should get quiz with where', async () => {
    const query = { isCorrect: true };

    const agent = await request(app)
      .get('/quizzes')
      .query({ where: JSON.stringify({ isCorrect: true }), count: 1 })
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(200);

    const results = await Quiz.find(query);
    expect(agent.body.count).toBe(results.length);
    expect(agent.body.results).toEqual(docToJSON(results));
  });

  test('should get quiz with populate', async () => {
    const agent = await request(app)
      .get('/quizzes')
      .query({
        populate: 'schedule'
      })
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(200);

    const results = await Quiz.find().populate('schedule');
    expect(agent.body.results).toEqual(docToJSON(results));
  });
});

describe('POST /quizzes', () => {
  test('should reate a new quiz', async () => {
    const agent = await request(app)
      .post('/quizzes')
      .set('Authorization', sessionToken)
      .send(quiz)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.CREATED);

    const result = await Quiz.findById(agent.body._id);
    expect(agent.body).toEqual(docToJSON(result));
  });
});

describe('GET /quiz/:id', () => {
  test('should get the quiz', async () => {
    const object = await dbQuizzes[0];

    const agent = await request(app)
      .get(`/quizzes/${object._id}`)
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    expect(agent.body).toEqual(object);
  });

  test('should get the quiz with populate', async () => {
    const result = await Quiz.findOne().populate('question');
    const id = result._id.toString();

    const agent = await request(app)
      .get(`/quizzes/${id}`)
      .query({ populate: 'question' })
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);
    expect(agent.body).toEqual(docToJSON(result));
  });
});

describe('PUT /quizzes', () => {
  test('should update the quiz', async () => {
    const object = dbQuizzes[0];

    const agent = await request(app)
      .put(`/quizzes/${object._id}`)
      .send(quiz)
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    const result = await Quiz.findById(object._id);
    expect(agent.body).toEqual(docToJSON(result));
  });

  test('should report error when quizzes does not exists', async () => {
    const id = mongoose.Types.ObjectId();

    const agent = await request(app)
      .put(`/quizzes/${id}`)
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.NOT_FOUND);
    expect(agent.body.code).toBe(404);
    expect(agent.body.message).toBe('Object not found.');
  });
});

describe('DELETE /quizzes', () => {
  test('should delete the quiz', async () => {
    const object = dbQuizzes[0];

    const agent = await request(app)
      .delete(`/quizzes/${object._id}`)
      .set('Authorization', sessionToken)
      .expect(httpStatus.NO_CONTENT);
    expect(agent.body).toEqual({});
    await expect(Quiz.findById(object._id)).resolves.toBeNull();
  });

  test('should report error when id does not exists', async () => {
    const id = mongoose.Types.ObjectId();

    const agent = await request(app)
      .delete(`/quizzes/${id}`)
      .set('Authorization', sessionToken)
      .expect(httpStatus.NOT_FOUND);
    expect(agent.body.code).toBe(404);
    expect(agent.body.message).toBe('Object not found.');
  });
});
