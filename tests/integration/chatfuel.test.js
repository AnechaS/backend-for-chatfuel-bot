const mongoose = require('mongoose');
const request = require('supertest');
const httpStatus = require('http-status');
const fetch = require('node-fetch');
const { Response } = jest.requireActual('node-fetch');
const app = require('../../app');
const config = require('config');
const { REPLY_SUBMITTED_TYPES } = require('../../app/utils/constants');
const cloudinary = require('../../app/utils/cloudinary');
const docToJSON = require('../docToJSON');

const People = require('../../app/models/people');
const Schedule = require('../../app/models/schedule');
const Question = require('../../app/models/question');
const Reply = require('../../app/models/reply');
const Progress = require('../../app/models/progress');
const Comment = require('../../app/models/comment');
const Quiz = require('../../app/models/quiz');

jest.mock('node-fetch');

mongoose.Promise = global.Promise;

let dbPeople;
let dbSchedule;
let dbQuestions;
let blockId = '5eb92fd7f58c2808c98e419b';

beforeEach(async () => {
  await People.deleteMany({});
  await Schedule.deleteMany({});
  await Question.deleteMany({});
  await Reply.deleteMany({});
  await Quiz.deleteMany({});
  await Progress.deleteMany({});
  await Comment.deleteMany({});

  const savedPeople = await People.create({
    _id: '3922551107771011',
    firstName: 'Sara',
    lastName: 'De',
    province: 'สงขลา',
    district: 'เทพา',
    dentalId: 'x',
    childName: 'Ant',
    childBirthday: '2560',
    gender: 'male'
  });

  dbPeople = docToJSON(savedPeople);

  const savedSchedule = await Schedule.create({
    name: 'Day 1'
  });

  dbSchedule = docToJSON(savedSchedule);

  const savedQuestion = await Question.create([
    {
      name: 'a',
      correctAnswers: [1],
      schedule: dbSchedule._id,
      type: 1
    },
    {
      name: 'b',
      schedule: dbSchedule._id,
      type: 3
    }
  ]);

  dbQuestions = docToJSON(savedQuestion);
});

afterEach(() => {
  fetch.mockReset();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('POST /chatfuel/people', () => {
  let payload;

  beforeEach(() => {
    payload = {
      id: '3922551107771012',
      firstName: 'Makus',
      lastName: 'Yui',
      province: 'สงขลา',
      district: 'เทพา',
      childName: 'Bee',
      childBirthday: '2560',
      gender: 'male',
      pic: 'https://platform-lookaside.fbsbx.com/...'
    };
  });

  test('should create a new people', async () => {
    const agent = await request(app)
      .post('/chatfuel/people')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.CREATED);

    expect(agent.body.result).toBe(true);

    const getPeople = await People.findById(payload.id).select(
      '-createdAt -updatedAt -__v'
    );

    payload._id = payload.id;
    delete payload.id;

    const result = docToJSON(getPeople);
    expect(result).toEqual(payload);
  });

  test('should create a new people with value null', async () => {
    const payloadX = {
      id: '3922551107771063',
      firstName: 'null',
      lastName: 'null',
      province: 'สงขลา',
      gender: 'null',
      pic: 'null'
    };

    const agent = await request(app)
      .post('/chatfuel/people')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payloadX)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.CREATED);

    expect(agent.body.result).toBe(true);

    const getPeople = await People.findById(payloadX.id);
    const result = docToJSON(getPeople);

    expect(result._id).toBe(payloadX.id);
    expect(result.province).toBe(payloadX.province);
  });

  test('should create a new people with childBirthday match b4', async () => {
    payload.childBirthday = 'b4 2561';

    const agent = await request(app)
      .post('/chatfuel/people')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.CREATED);

    expect(agent.body.result).toBe(true);

    const getPeople = await People.findById(payload.id).select(
      '-createdAt -updatedAt -__v'
    );

    payload.childBirthday = 'ก่อน 2561';
    payload._id = payload.id;
    delete payload.id;
    const result = docToJSON(getPeople);
    expect(result).toMatchObject(payload);
  });

  test('should update the people if id is exists', async () => {
    delete payload.id;

    const agent = await request(app)
      .post('/chatfuel/people')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send({
        id: dbPeople._id,
        ...payload
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.CREATED);

    expect(agent.body.result).toBe(true);

    const getPeople = await People.findById(dbPeople._id).select(
      '-createdAt -updatedAt -__v'
    );

    payload._id = dbPeople._id;

    const result = docToJSON(getPeople);
    expect(result).toMatchObject(payload);
  });

  test('should report error when id is not provided', async () => {
    delete payload.id;

    const agent = await request(app)
      .post('/chatfuel/people')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST);

    expect(agent.body.code).toBe(400);
    expect(agent.body.message).toBe('Validation Error');

    const { field, location, message } = agent.body.errors[0];
    expect(field).toBe('id');
    expect(location).toBe('body');
    expect(message).toBe('Is required');
  });

  test('should report error when without api key', async () => {
    const agent = await request(app)
      .post('/chatfuel/people')
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.FORBIDDEN);

    expect(agent.body.code).toBe(httpStatus.FORBIDDEN);
    expect(agent.body.message).toBe('Forbidden');
  });
});

describe('POST /chatfuel/reply', () => {
  let payload;
  let payloadQuiz;

  beforeEach(() => {
    payload = {
      people: dbPeople._id,
      schedule: dbSchedule._id,
      text: 'Hi',
      submittedType: REPLY_SUBMITTED_TYPES[0],
      blockId
    };

    payloadQuiz = {
      people: dbPeople._id,
      schedule: dbSchedule._id,
      blockId,
      text: 'a',
      submittedType: REPLY_SUBMITTED_TYPES[0],
      quiz: {
        question: dbQuestions[0]._id,
        answer: 1
      }
    };
  });

  test('should create a new reply', async () => {
    const agent = await request(app)
      .post('/chatfuel/reply')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.CREATED);
    expect(agent.body.result).toBe(true);

    const object = await Reply.findOne({
      people: payload.people
    }).select('-createdAt -updatedAt -createdAt -__v');
    const result = docToJSON(object);
    expect(result).toMatchObject({
      ...payload,
      blockId: blockId
    });
  });

  test('should update reply when blockid and people exists', async () => {
    const prevResult = await Reply.create({
      people: payload.people,
      schedule: payload.schedule,
      text: 'x',
      blockId
    });

    const agent = await request(app)
      .post('/chatfuel/reply')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.CREATED);
    expect(agent.body.result).toBe(true);

    const object = await Reply.find({
      people: payload.people,
      schedule: payload.schedule
    }).select('-createdAt -updatedAt -createdAt -__v');
    const [result] = docToJSON(object);

    expect(object).toHaveLength(1);
    expect(prevResult._id.toString()).toBe(result._id);
    expect(result).toMatchObject({
      ...payload,
      blockId: blockId
    });
  });

  test('should create a new reply and quiz when answer correct', async () => {
    const agent = await request(app)
      .post('/chatfuel/reply')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payloadQuiz)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.CREATED);
    expect(agent.body.result).toBe(true);

    const { quiz, ...o } = payloadQuiz;

    const getReply = await Reply.findOne({
      people: payload.people
    }).select('-createdAt -updatedAt -createdAt -__v');
    const resultReply = docToJSON(getReply);
    expect(resultReply).toMatchObject({
      ...o,
      blockId: blockId
    });

    const getQuiz = await Quiz.findOne({ people: payload.people }).select(
      '-createdAt -updatedAt -createdAt -__v'
    );
    const resultQuiz = docToJSON(getQuiz);
    expect(resultQuiz).toMatchObject({
      ...quiz,
      isCorrect: true
    });
  });

  test('should create a new reply and quiz when answer wrong', async () => {
    payloadQuiz.quiz.answer = 2;

    const agent = await request(app)
      .post('/chatfuel/reply')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payloadQuiz)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.CREATED);
    expect(agent.body.result).toBe(true);

    const { quiz, ...o } = payloadQuiz;

    const getReply = await Reply.findOne({
      people: payload.people
    }).select('-createdAt -updatedAt -createdAt -__v');
    const resultReply = docToJSON(getReply);
    expect(resultReply).toMatchObject({
      ...o,
      blockId: blockId
    });

    const getQuiz = await Quiz.findOne({
      people: payload.people
    }).select('-createdAt -updatedAt -createdAt -__v');
    const resultQuiz = docToJSON(getQuiz);
    expect(resultQuiz).toMatchObject({
      ...quiz,
      isCorrect: false
    });
  });

  test('should create a new reply and progress', async () => {
    delete payload.text;
    delete payload.type;

    payload.progress = { status: 1 };

    const agent = await request(app)
      .post('/chatfuel/reply')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.CREATED);

    expect(agent.body.result).toBe(true);

    const getProgress = await Progress.findOne({
      people: payload.people
    }).select('-createdAt -updatedAt -createdAt -__v');
    const result = docToJSON(getProgress);

    expect(result.people).toBe(payload.people);
    expect(result.schedule).toBe(payload.schedule);
    expect(result.status).toBe(payload.progress.status);
  });

  test('should create a new reply and change status the progress', async () => {
    payload.progress = { status: 2 };

    const agent = await request(app)
      .post('/chatfuel/reply')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.CREATED);

    expect(agent.body.result).toBe(true);

    const getProgresses = await Progress.find({
      people: payload.people
    }).select('-createdAt -updatedAt -createdAt -__v');
    const [resultProgress] = getProgresses;
    expect(getProgresses).toHaveLength(1);
    expect(resultProgress.people.toString()).toBe(payload.people);
    expect(resultProgress.schedule.toString()).toBe(payload.schedule);
    expect(resultProgress.status).toBe(payload.progress.status);

    delete payload.progress;

    const getReply = await Reply.findOne({
      people: payload.people
    }).select('-createdAt -updatedAt -createdAt -__v');
    const resultReply = docToJSON(getReply);
    expect(resultReply).toMatchObject({
      ...payload,
      blockId: blockId
    });
  });

  test('should create a new reply and people when exists the user of chatfuel', async () => {
    payload.people = '3922551107771013';

    fetch.mockReturnValue(
      Promise.resolve(
        new Response(
          JSON.stringify({
            result: {
              total_count: 2615,
              count: 1,
              users: [
                [
                  {
                    type: 'system',
                    name: 'user id',
                    values: ['3922551107771013'],
                    count: 0
                  },
                  {
                    type: 'system',
                    name: 'gender',
                    values: ['female'],
                    count: 0
                  },
                  {
                    type: 'system',
                    name: 'first name',
                    values: ['asdf'],
                    count: 0
                  },
                  {
                    type: 'system',
                    name: 'profile pic url',
                    values: [
                      'https://images.chatfuel.com/user/raw/103453611060507/5ebd4342bbcf1f26aec/profile.jpeg'
                    ],
                    count: 0
                  },
                  {
                    type: 'system',
                    name: 'last name',
                    values: ['jkl'],
                    count: 0
                  },
                  {
                    type: 'system',
                    name: 'messenger user id',
                    values: ['3922551107771013'],
                    count: 0
                  },
                  {
                    type: 'custom',
                    name: 'region',
                    values: ['กลาง'],
                    count: 0
                  },
                  {
                    type: 'custom',
                    name: 'province',
                    values: ['ปทุมธานี'],
                    count: 0
                  },
                  {
                    type: 'custom',
                    name: 'name',
                    values: ['ฟาเร'],
                    count: 0
                  },
                  {
                    type: 'custom',
                    name: 'year',
                    values: ['b4 2561'],
                    count: 0
                  }
                ]
              ]
            },
            success: true
          })
        )
      )
    );

    const agent = await request(app)
      .post('/chatfuel/reply')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.CREATED);
    expect(agent.body.result).toBe(true);

    const getPeople = await People.findById(payload.people).select(
      '-createdAt -updatedAt -createdAt -__v'
    );
    const resultPeople = docToJSON(getPeople);
    expect(resultPeople).toEqual({
      _id: '3922551107771013',
      gender: 'female',
      firstName: 'asdf',
      pic:
        'https://images.chatfuel.com/user/raw/103453611060507/5ebd4342bbcf1f26aec/profile.jpeg',
      lastName: 'jkl',
      province: 'ปทุมธานี',
      childName: 'ฟาเร',
      childBirthday: 'ก่อน 2561'
    });
  });

  test('should report error when people is not provided', async () => {
    delete payload.people;

    const agent = await request(app)
      .post('/chatfuel/reply')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST);

    expect(agent.body.code).toBe(400);
    expect(agent.body.message).toBe('Validation Error');

    const { field, location, message } = agent.body.errors[0];
    expect(field).toBe('people');
    expect(location).toBe('body');
    expect(message).toBe('Is required');
  });

  test('should report error when people is not exists', async () => {
    payload.people = '2432046740184515';

    fetch.mockReturnValue(
      Promise.resolve(
        new Response(
          JSON.stringify({
            result: {
              total_count: 0,
              count: 0,
              users: []
            },
            success: true
          })
        )
      )
    );

    const agent = await request(app)
      .post('/chatfuel/reply')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST);
    expect(agent.body.code).toBe(400);
    expect(agent.body.message).toBe('Validation Error');

    const { field, location, message } = agent.body.errors[0];
    expect(field).toBe('people');
    expect(location).toBe('body');
    expect(message).toBe('Invalid value');
  });

  test('should report error when schedule is not provided', async () => {
    delete payload.schedule;

    const agent = await request(app)
      .post('/chatfuel/reply')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST);

    expect(agent.body.code).toBe(400);
    expect(agent.body.message).toBe('Validation Error');

    const { field, location, message } = agent.body.errors[0];
    expect(field).toBe('schedule');
    expect(location).toBe('body');
    expect(message).toBe('Is required');
  });

  test('should report error when schedule is not exists', async () => {
    payload.schedule = 'asdfgh';

    const agent = await request(app)
      .post('/chatfuel/reply')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST);

    expect(agent.body.code).toBe(400);
    expect(agent.body.message).toBe('Validation Error');

    const { field, location, message } = agent.body.errors[0];
    expect(field).toBe('schedule');
    expect(location).toBe('body');
    expect(message).toBe('Invalid value');
  });

  test('should report error when blockId is not provided', async () => {
    delete payload.blockId;

    const agent = await request(app)
      .post('/chatfuel/reply')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST);

    expect(agent.body.code).toBe(400);
    expect(agent.body.message).toBe('Validation Error');

    const { field, location, message } = agent.body.errors[0];
    expect(field).toBe('blockId');
    expect(location).toBe('body');
    expect(message).toBe('Is required');
  });

  test('should report error when blockId not match', async () => {
    payload.blockId = 'asdfgh';

    const agent = await request(app)
      .post('/chatfuel/reply')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST);

    expect(agent.body.code).toBe(400);
    expect(agent.body.message).toBe('Validation Error');

    const { field, location, message } = agent.body.errors[0];
    expect(field).toBe('blockId');
    expect(location).toBe('body');
    expect(message).toBe('Invalid value');
  });

  test('should report error when submittedType not match', async () => {
    payload.submittedType = 'avasdf';

    const agent = await request(app)
      .post('/chatfuel/reply')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST);

    expect(agent.body.code).toBe(400);
    expect(agent.body.message).toBe('Validation Error');

    const { field, location, message } = agent.body.errors[0];
    expect(field).toBe('submittedType');
    expect(location).toBe('body');
    expect(message).toBe('Invalid value');
  });

  test.each([
    ['is equal to empty', ''],
    ['not match mongo id', 'asdf'],
    ['is not exists', mongoose.Types.ObjectId().toString()]
  ])('should report error when quiz question %s', async (s, v) => {
    payload.quiz = { question: v, answer: 1 };

    const agent = await request(app)
      .post('/chatfuel/reply')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST);

    expect(agent.body.code).toBe(400);
    expect(agent.body.message).toBe('Validation Error');

    const { field, location, message } = agent.body.errors[0];
    expect(field).toBe('quiz.question');
    expect(location).toBe('body');
    expect(message).toBe(v ? 'Invalid value' : 'Is required');
  });

  test.each([
    ['is equal to empty', ''],
    ['is equal to text', 'asdf']
  ])('should report error when quiz answer %s', async (s, v) => {
    payload.quiz = { question: dbQuestions[0]._id, answer: v };

    const agent = await request(app)
      .post('/chatfuel/reply')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST);

    expect(agent.body.code).toBe(400);
    expect(agent.body.message).toBe('Validation Error');

    const { field, location, message } = agent.body.errors[0];
    expect(field).toBe('quiz.answer');
    expect(location).toBe('body');
    expect(message).toBe(v ? 'Invalid value' : 'Is required');
  });

  test.each([
    ['is equal to empty', ''],
    ['less then 1', '0'],
    ['more then 2', '3']
  ])('should report error when progress status %s', async (s, v) => {
    payload.progress = { status: v };

    const agent = await request(app)
      .post('/chatfuel/reply')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST);

    expect(agent.body.code).toBe(400);
    expect(agent.body.message).toBe('Validation Error');

    const { field, location, message } = agent.body.errors[0];
    expect(field).toBe('progress.status');
    expect(location).toBe('body');
    expect(message).toBe(v ? 'Invalid value' : 'Is required');
  });
});

describe('POST /chatfuel/comment', () => {
  let payload;

  beforeEach(() => {
    payload = {
      people: dbPeople._id,
      question: dbQuestions[1]._id,
      answer: 'good'
    };
  });

  test('should create a new comment', async () => {
    const agent = await request(app)
      .post('/chatfuel/comment')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.CREATED);

    expect(agent.body).toEqual({ result: true });

    let result = await Comment.findOne({
      people: payload.people
    }).select('-createdAt -createdAt -updatedAt -__v');
    result = docToJSON(result);
    expect(result.people).toBe(payload.people);
    expect(result.question).toBe(payload.question);
    expect(result.answer).toBe(payload.answer);
  });

  test('should update comment when exist people and question', async () => {
    const oldResult = await Comment.create(payload);

    payload.answer = 'bad';

    const agent = await request(app)
      .post('/chatfuel/comment')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.CREATED);

    expect(agent.body).toEqual({ result: true });

    const results = await Comment.find({
      people: payload.people
    }).select('-createdAt -createdAt -updatedAt -__v');
    const result = docToJSON(results[0]);
    expect(results).toHaveLength(1);
    expect(result._id).toBe(oldResult._id.toString());
    expect(result.people).toBe(payload.people);
    expect(result.question).toBe(payload.question);
    expect(result.answer).toBe(payload.answer);
  });

  test('should create a new comment and create a new people when api chatfuel is exists', async () => {
    payload.people = '40738040699c7951';

    fetch.mockReturnValue(
      Promise.resolve(
        new Response(
          JSON.stringify({
            result: {
              total_count: 2615,
              count: 1,
              users: [
                [
                  {
                    type: 'system',
                    name: 'user id',
                    values: ['5ebd43c2b3142bbff1f26aec'],
                    count: 0
                  },
                  {
                    type: 'system',
                    name: 'gender',
                    values: ['female'],
                    count: 0
                  },
                  {
                    type: 'system',
                    name: 'first name',
                    values: ['asdf'],
                    count: 0
                  },
                  {
                    type: 'system',
                    name: 'profile pic url',
                    values: [
                      'https://images.chatfuel.com/user/raw/103453611060507/5ebd4342bbcf1f26aec/profile.jpeg'
                    ],
                    count: 0
                  },
                  {
                    type: 'system',
                    name: 'last name',
                    values: ['jkl'],
                    count: 0
                  },
                  {
                    type: 'system',
                    name: 'messenger user id',
                    values: ['40738040699c7951'],
                    count: 0
                  },
                  {
                    type: 'custom',
                    name: 'region',
                    values: ['กลาง'],
                    count: 0
                  },
                  {
                    type: 'custom',
                    name: 'province',
                    values: ['ปทุมธานี'],
                    count: 0
                  },
                  {
                    type: 'custom',
                    name: 'name',
                    values: ['ฟาเร'],
                    count: 0
                  },
                  {
                    type: 'custom',
                    name: 'year',
                    values: ['b4 2561'],
                    count: 0
                  }
                ]
              ]
            },
            success: true
          })
        )
      )
    );

    const agent = await request(app)
      .post('/chatfuel/comment')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.CREATED);
    expect(agent.body.result).toBe(true);

    const getPeople = await People.findById(payload.people).select(
      '-createdAt -updatedAt -__v'
    );
    const resultPeople = docToJSON(getPeople);
    expect(resultPeople).toEqual({
      _id: '40738040699c7951',
      gender: 'female',
      firstName: 'asdf',
      pic:
        'https://images.chatfuel.com/user/raw/103453611060507/5ebd4342bbcf1f26aec/profile.jpeg',
      lastName: 'jkl',
      province: 'ปทุมธานี',
      childName: 'ฟาเร',
      childBirthday: 'ก่อน 2561'
    });
  });
});

describe('POST /chatfuel/cetificate', () => {
  let payload;

  beforeEach(() => {
    payload = {
      public_id: dbPeople._id,
      image: 'https://scontent.xx.fbcdn.net/v/t1.15752-9/cat.jpg',
      name: `${dbPeople.firstName} ${dbPeople.lastName}`
    };
  });

  test('should generate image certificate', async () => {
    jest.spyOn(cloudinary, 'upload').mockResolvedValue({
      asset_id: 'd028e60447be58a86aae0fb025179010',
      public_id: 'cat',
      version: 1590419344,
      version_id: 'd493d21c1c4bb627ebc46a6c5e48e1d3',
      signature: '30ba44301ab9b55e2498091708d4dc3f17dc06e5',
      width: 1000,
      height: 558,
      format: 'jpg',
      resource_type: 'image',
      result_at: '2020-05-25T15:09:04Z',
      tags: [],
      bytes: 72516,
      type: 'upload',
      etag: 'ad2edb4ec9f4526f05d138b87e02a076',
      placeholder: false,
      url: 'http://res.cloudinary.com/simple/image/upload/v1590419344/cat.jpg',
      secure_url:
        'https://res.cloudinary.com/simple/image/upload/v1590419344/cat.jpg',
      original_filename: 'cat'
    });

    const agent = await request(app)
      .post('/chatfuel/certificate')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    expect(cloudinary.upload).toHaveBeenCalled();

    expect(agent.body).toEqual({
      result: true,
      set_attributes: {
        request_certificate_success: '1'
      },
      messages: [
        {
          attachment: {
            type: 'image',
            payload: {
              url: cloudinary.image(
                'cat',
                `${dbPeople.firstName} ${dbPeople.lastName}`
              )
            }
          }
        }
      ]
    });

    cloudinary.upload.mockRestore();
  });

  test('should report error when image is not provided', async () => {
    delete payload.image;

    const agent = await request(app)
      .post('/chatfuel/certificate')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST);

    expect(agent.body.code).toBe(400);
    expect(agent.body.message).toBe('Validation Error');

    const { field, location, message } = agent.body.errors[0];
    expect(field).toBe('image');
    expect(location).toBe('body');
    expect(message).toBe('Is required');
  });

  test('should report when image value not match', async () => {
    payload.image = 'http://example.com/abcd';

    const agent = await request(app)
      .post('/chatfuel/certificate')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    expect(agent.body).toEqual({
      result: false,
      set_attributes: {
        request_certificate_success: '0'
      }
    });
  });

  test('should report error when name is not provided', async () => {
    delete payload.name;

    const agent = await request(app)
      .post('/chatfuel/certificate')
      .query({ api_key: config.get('app.apiPublicKey') })
      .send(payload)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST);

    expect(agent.body.code).toBe(400);
    expect(agent.body.message).toBe('Validation Error');

    const { field, location, message } = agent.body.errors[0];
    expect(field).toBe('name');
    expect(location).toBe('body');
    expect(message).toBe('Is required');
  });
});
