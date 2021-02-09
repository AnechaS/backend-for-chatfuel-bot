/* eslint-disable no-unused-vars, no-undef */
const mongoose = require('mongoose');
const request = require('supertest');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const faker = require('faker');
const moment = require('moment');
const _ = require('lodash');
const docToJSON = require('../docToJSON');

const app = require('../../app');
const User = require('../../app/models/user');
const SessionToken = require('../../app/models/sessionToken');
const People = require('../../app/models/people');
const Schedule = require('../../app/models/schedule');
const Reply = require('../../app/models/reply');
const Progress = require('../../app/models/progress');

mongoose.Promise = global.Promise;

let sessionToken;
let dbPeoples = [];
let dbSchedules = [];
let dbProgresses = [];

const RealDate = Date.now;
beforeAll(() => {
  global.Date.now = jest.fn(() =>
    new Date('2020-04-05T16:59:59.999Z').getTime()
  );
});
afterAll(() => {
  global.Date.now = RealDate;
});

beforeEach(async () => {
  await User.deleteMany({});
  await SessionToken.deleteMany({});
  await Reply.deleteMany({});
  await Schedule.deleteMany({});
  await People.deleteMany({});
  await Progress.deleteMany({});

  const passwordHashed = await bcrypt.hash('1234', 1);
  const savedUser = await User.create({
    email: 'jonsnow@gmail.com',
    password: passwordHashed,
    username: 'Jon Snow',
    role: 'admin'
  });
  sessionToken = SessionToken.generate(savedUser).token;

  const mockDataPeoples = [
    {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      gender: 'male',
      profilePicUrl: faker.image.image(),
      province: 'สงขลา',
      district: 'เทพา',
      dentalId: faker.helpers.replaceSymbolWithNumber('######'),
      childName: faker.name.firstName(),
      childBirthday: 'ก่อน 2560',
      createdAt: moment.utc('2020-04-04')
    },
    {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      gender: 'male',
      profilePicUrl: faker.image.image(),
      province: 'สงขลา',
      district: 'เมือง',
      dentalId: faker.helpers.replaceSymbolWithNumber('######'),
      childName: faker.name.firstName(),
      childBirthday: '2561',
      createdAt: moment.utc('2020-04-03')
    },
    {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      gender: 'female',
      profilePicUrl: faker.image.image(),
      province: 'สงขลา',
      district: 'หาดใหญ่',
      dentalId: 'x',
      childName: faker.name.firstName(),
      childBirthday: '2560',
      createdAt: moment.utc('2020-04-04')
    },
    {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      gender: 'female',
      profilePicUrl: faker.image.image(),
      province: 'สงขลา',
      district: 'หาดใหญ่',
      dentalId: 'x',
      childName: faker.name.firstName(),
      childBirthday: '2560',
      createdAt: moment.utc('2020-04-02')
    },
    {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      gender: 'female',
      profilePicUrl: faker.image.image(),
      province: 'สงขลา',
      district: 'อำเภออื่นๆ',
      dentalId: 'x',
      childName: faker.name.firstName(),
      childBirthday: '2560',
      createdAt: moment.utc('2020-04-03')
    },
    {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      gender: 'female',
      profilePicUrl: faker.image.image(),
      province: 'สงขลา',
      district: 'อำเภออื่นๆ',
      dentalId: 'x',
      childName: faker.name.firstName(),
      childBirthday: '2560',
      createdAt: moment.utc('2020-04-05')
    }
  ];

  const savedPeoples = await People.insertMany(mockDataPeoples);
  dbPeoples = docToJSON(savedPeoples);

  const mockDataSchedules = Array.from({ length: 22 }, (_, i) => ({
    name: `Day ${i + 1}`
  }));
  const savedSchedules = await Schedule.insertMany(mockDataSchedules);
  dbSchedules = docToJSON(savedSchedules);

  const savedReplys = await Reply.insertMany([
    ...dbSchedules.map((o, i) => ({
      people: dbPeoples[0]._id,
      schedule: o._id,
      text: `hello${i + 1}`,
      blockId: (i + 1).toString()
    })),
    ...dbSchedules.map((o, i) => ({
      people: dbPeoples[1]._id,
      schedule: o._id,
      text: `hello${i + 1}`,
      blockId: (i + 1).toString()
    })),
    ...dbSchedules
      .slice()
      .splice(0, 15)
      .map((o, i) => ({
        people: dbPeoples[2]._id,
        schedule: o._id,
        text: `hello${i + 1}`,
        blockId: (i + 1).toString()
      })),
    ...dbSchedules
      .slice()
      .splice(0, 10)
      .map((o, i) => ({
        people: dbPeoples[3]._id,
        schedule: o._id,
        text: `hello${i + 1}`,
        blockId: (i + 1).toString()
      })),
    ...dbSchedules.map((o, i) => ({
      people: dbPeoples[5]._id,
      schedule: o._id,
      text: `hello${i + 1}`,
      blockId: (i + 1).toString()
    }))
  ]);
  dbReplys = docToJSON(savedReplys);

  const savedProgresses = await Progress.insertMany([
    ...dbSchedules.map(o => ({
      people: dbPeoples[0]._id,
      schedule: o._id,
      status: 2
    })),
    ...dbSchedules.map(o => ({
      people: dbPeoples[1]._id,
      schedule: o._id,
      status: 2
    })),
    ...dbSchedules
      .slice()
      .splice(0, 15)
      .map(o => ({
        people: dbPeoples[2]._id,
        schedule: o._id,
        status: 2
      })),
    ...dbSchedules
      .slice()
      .splice(0, 10)
      .map(o => ({
        people: dbPeoples[3]._id,
        schedule: o._id,
        status: 2
      })),
    { people: dbPeoples[3]._id, schedule: dbSchedules[10]._id, status: 1 },
    ...dbSchedules
      .slice()
      .splice(0, 15)
      .map(o => ({
        people: dbPeoples[5]._id,
        schedule: o._id,
        status: 2
      }))
  ]);
  dbProgresses = docToJSON(savedProgresses);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('GET /widgets/1', () => {
  test('should get data', async () => {
    const agent = await request(app)
      .get('/widgets/1')
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);
    expect(agent.body.value).toBe(dbPeoples.length);
  });

  test('should get data with query', async () => {
    const agent = await request(app)
      .get('/widgets/1')
      .query({
        q: JSON.stringify({
          createdAt: {
            $lte: moment('2020-04-04')
              .endOf('day')
              .toDate()
          }
        })
      })
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);
    expect(agent.body.value).toBe(5);
  });

  test('should report error when query is not json', async () => {
    const agent = await request(app)
      .get('/widgets/1')
      .query({
        q: '{x}'
      })
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST);
    expect(agent.body.code).toBe(400);
    expect(agent.body.message).toBe('Validation Error');
    expect(agent.body.errors).toEqual([
      { field: 'q', location: 'query', message: 'Invalid value' }
    ]);
  });
});

describe('GET /widgets/2', () => {
  test('should get data', async () => {
    const agent = await request(app)
      .get('/widgets/2')
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);
    expect(agent.body.value).toBe(2);
    expect(agent.body.percent).toBe(33.33);
  });

  test('should get data with query', async () => {
    const agent = await request(app)
      .get('/widgets/2')
      .query({
        q: JSON.stringify({
          createdAt: {
            $lte: moment('2020-04-04')
              .endOf('day')
              .toDate()
          }
        })
      })
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    expect(agent.body.value).toBe(2);
    expect(agent.body.percent).toBe(40);
  });
});

describe('GET /widgets/3', () => {
  test('should get data', async () => {
    const agent = await request(app)
      .get('/widgets/3')
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);
    expect(agent.body.value).toBe(4);
    expect(agent.body.percent).toBe(66.67);
  });

  test('should get data with query', async () => {
    const agent = await request(app)
      .get('/widgets/3')
      .query({
        q: JSON.stringify({
          createdAt: {
            $lte: moment('2020-04-04')
              .endOf('day')
              .toDate()
          }
        })
      })
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    expect(agent.body.value).toBe(3);
    expect(agent.body.percent).toBe(60);
  });
});

describe('GET /widgets/4', () => {
  test('should get data', async () => {
    const agent = await request(app)
      .get('/widgets/4')
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    expect(agent.body.data).toHaveLength(11);
    expect(agent.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          t: moment().valueOf(),
          y: 6
        })
      ])
    );
  });

  test('should get data with period is year', async () => {
    const agent = await request(app)
      .get('/widgets/4')
      .query({ period: 'year' })
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    expect(agent.body.data).toHaveLength(2);
    expect(agent.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          t: moment().valueOf(),
          y: 6
        })
      ])
    );
  });

  test('should get data with period is day', async () => {
    const agent = await request(app)
      .get('/widgets/4')
      .query({ period: 'day' })
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    expect(agent.body.data).toHaveLength(31);
    expect(agent.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          t: moment('2020-04-02')
            .endOf('day')
            .valueOf(),
          y: 1
        }),
        expect.objectContaining({
          t: moment('2020-04-03')
            .endOf('day')
            .valueOf(),
          y: 2
        }),
        expect.objectContaining({
          t: moment('2020-04-04')
            .endOf('day')
            .valueOf(),
          y: 2
        }),
        expect.objectContaining({
          t: moment().valueOf(),
          y: 1
        })
      ])
    );
  });

  test('should get data with end date', async () => {
    const agent = await request(app)
      .get('/widgets/4')
      .query({ endDate: '2020-04-04' })
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    expect(agent.body.data).toHaveLength(11);
    expect(agent.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          t: moment('2020-04-04')
            .endOf('day')
            .valueOf(),
          y: 5
        })
      ])
    );
  });

  test('should get data with end date', async () => {
    const agent = await request(app)
      .get('/widgets/4')
      .query({ startDate: '2020-04-04' })
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    expect(agent.body.data).toHaveLength(1);
    expect(agent.body.data).toEqual([
      {
        t: moment().valueOf(),
        y: 3
      }
    ]);
  });

  test('should get data with end and start date', async () => {
    const agent = await request(app)
      .get('/widgets/4')
      .query({ startDate: '2020-03-02', endDate: '2020-04-04' })
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    expect(agent.body.data).toHaveLength(2);
    expect(agent.body.data).toEqual([
      {
        t: moment('2020-03-02').valueOf(),
        y: 0
      },
      {
        t: moment('2020-04-04')
          .endOf('day')
          .valueOf(),
        y: 5
      }
    ]);
  });
});

describe('GET /widgets/5', () => {
  test('should get data', async () => {
    const agent = await request(app)
      .get('/widgets/5')
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    expect(agent.body.data).toEqual([
      {
        province: 'สงขลา',
        count: 6
      }
    ]);
  });
});

describe('GET /widgets/6', () => {
  test('should get data', async () => {
    const agent = await request(app)
      .get('/widgets/6')
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    expect(agent.body.data).toEqual([
      {
        province: 'สงขลา',
        count: 5,
        countDId: 2,
        countG: 3
      }
    ]);
  });
});

describe('GET /widgets/7', () => {
  test('should get data', async () => {
    const agent = await request(app)
      .get('/widgets/7')
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    expect(agent.body.data).toEqual(expect.arrayContaining([
      {
        province: 'สงขลา',
        district: 'หาดใหญ่',
        count: 2
      },
      {
        province: 'สงขลา',
        district: 'อำเภออื่นๆ',
        count: 2
      },
      {
        province: 'สงขลา',
        district: 'เมือง',
        count: 1
      },
      {
        province: 'สงขลา',
        district: 'เทพา',
        count: 1
      }
    ]));
  });
});

describe('GET /widgets/8', () => {
  test('should get data', async () => {
    const agent = await request(app)
      .get('/widgets/8')
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    expect(agent.body.data).toEqual([
      {
        province: 'สงขลา',
        district: 'หาดใหญ่',
        count: 2,
        countDId: 0,
        countG: 2
      },
      {
        province: 'สงขลา',
        district: 'อำเภออื่นๆ',
        count: 1,
        countDId: 0,
        countG: 1
      },
      {
        province: 'สงขลา',
        district: 'เมือง',
        count: 1,
        countDId: 1,
        countG: 0
      },
      {
        province: 'สงขลา',
        district: 'เทพา',
        count: 1,
        countDId: 1,
        countG: 0
      }
    ]);
  });
});

describe('GET /widgets/9', () => {
  test('should get data', async () => {
    const agent = await request(app)
      .get('/widgets/9')
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    const matchesData = dbSchedules.map((o, index) => {
      let count = 0;
      if (index < 10) {
        count = 5;
      } else if (index < 15) {
        count = 4;
      } else {
        count = 2;
      }

      return {
        x: o.name,
        y: Number(((count / 6) * 100).toFixed(2)),
        count
      };
    });

    expect(agent.body.data).toEqual(matchesData);
  });

  test('should get data with query', async () => {
    const agent = await request(app)
      .get('/widgets/9')
      .query({
        q: JSON.stringify({
          createdAt: {
            $lte: moment('2020-04-04')
              .endOf('day')
              .toDate()
          }
        })
      })
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    const matchesData = dbSchedules.map((o, index) => {
      let count = 0;
      if (index < 10) {
        count = 4;
      } else if (index < 15) {
        count = 3;
      } else {
        count = 2;
      }

      return {
        x: o.name,
        y: Number(((count / 5) * 100).toFixed(2)),
        count
      };
    });

    expect(agent.body.data).toEqual(matchesData);
  });
});

describe('GET /widgets/10', () => {
  test('should get data', async () => {
    const agent = await request(app)
      .get('/widgets/10')
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    const matchData = dbPeoples
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .splice(0, 5);
    expect(agent.body.data).toEqual(matchData);
  });

  test('should get data with query', async () => {
    const agent = await request(app)
      .get('/widgets/10')
      .query({
        q: JSON.stringify({
          createdAt: {
            $lte: moment('2020-04-04')
              .endOf('day')
              .toDate()
          }
        })
      })
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    const matchData = dbPeoples
      .filter(o => moment(o.createdAt).isSameOrBefore('2020-04-04', 'day'))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    expect(agent.body.data).toEqual(matchData);
  });

  test('should get data with limit', async () => {
    const agent = await request(app)
      .get('/widgets/10')
      .query({ limit: 2 })
      .set('Accept', 'application/json')
      .set('Authorization', sessionToken)
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK);

    expect(agent.body.data).toHaveLength(2);
    const matchData = dbPeoples
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .splice(0, 2);
    expect(agent.body.data).toEqual(matchData);
  });
});
