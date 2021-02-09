const mongoose = require('mongoose');
const request = require('supertest');
const httpStatus = require('http-status');
const config = require('config');
const app = require('../../app');

mongoose.model(
  'Person',
  new mongoose.Schema(
    {
      name: {
        type: String,
        trim: true,
      },
      power: {
        type: Number,
      },
    },
    {
      timestamps: true,
    }
  )
);

mongoose.model(
  'Message',
  new mongoose.Schema(
    {
      person: {
        type: String,
        ref: 'Person',
        index: true,
        required: true,
      },
      text: {
        type: String,
        trim: true,
      },
    },
    {
      timestamps: true,
    }
  )
);

const User = mongoose.models.User;
const Session = mongoose.models.Session;
const Person = mongoose.models.Person;
const Message = mongoose.models.Message;

let sessionToken;

beforeEach(async () => {
  await User.deleteMany({});
  await Session.deleteMany({});
  await Person.deleteMany({});
  await Message.deleteMany({});

  const user = await User.create({
    email: 'admin@email.com',
    password: '123456',
    name: 'Admin',
    role: 'admin',
  });
  sessionToken = await Session.generate(user).sessionToken;

  const persons = await Person.insertMany([
    {
      name: 'Goku',
      power: 10,
    },
    {
      name: 'Krillin',
      power: 5,
    },
  ]);

  /* const messages =  */ await Message.insertMany([
    {
      person: persons[0]._id,
      text: 'Hello',
    },
    {
      person: persons[1]._id,
      text: 'Hi',
    },
  ]);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('GET /classes/:modelName', () => {
  test('should get decuments', () => {
    return request(app)
      .get('/classes/Person')
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.results[0].name).toBe('Goku');
        expect(res.body.results[1].name).toBe('Krillin');
      });
  });

  test('should get decuments when send parameter "where"', () => {
    return request(app)
      .get('/classes/Person')
      .query({ where: JSON.stringify({ name: 'Goku' }) })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.results[0].name).toBe('Goku');
      });
  });

  test('should error when send parameter "where" invalid', async () => {
    return request(app)
      .get('/classes/Person')
      .query({ where: 'foo' })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.INTERNAL_SERVER_ERROR);
  });

  test('should get documents when send parameter "select"', async () => {
    return request(app)
      .get('/classes/Person')
      .query({ select: 'name' })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.results[0]).toEqual({
          _id: expect.any(String),
          name: 'Goku',
        });
        expect(res.body.results[1]).toEqual({
          _id: expect.any(String),
          name: 'Krillin',
        });
      });
  });

  test('should get documents when send parameter "sort"', async () => {
    return request(app)
      .get('/classes/Person')
      .query({ sort: '-name' })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.results[0].name).toBe('Krillin');
        expect(res.body.results[1].name).toBe('Goku');
      });
  });

  test('should get documents when send parameter "skip"', async () => {
    return request(app)
      .get('/classes/Person')
      .query({ skip: 1 })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.results.length).toBe(1);
        expect(res.body.results[0].name).toEqual('Krillin');
      });
  });

  test('should get documents when send parameter "limit"', async () => {
    return request(app)
      .get('/classes/Person')
      .query({ limit: 1 })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK)
      .then(async (res) => {
        expect(res.body.results.length).toBe(1);
        expect(res.body.results[0].name).toEqual('Goku');
      });
  });

  test('should get documents when send parameter "populate"', () => {
    return request(app)
      .get('/classes/Message')
      .query({ populate: 'person' })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.results[0].text).toBe('Hello');
        expect(res.body.results[0].person.name).toBe('Goku');
        expect(res.body.results[1].text).toBe('Hi');
        expect(res.body.results[1].person.name).toBe('Krillin');
      });
  });

  test('should get documents when send parameter "populate" and select fields', () => {
    return request(app)
      .get('/classes/Message')
      .query({ populate: JSON.stringify({ path: 'person', select: 'name' }) })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.results[0].text).toBe('Hello');
        expect(res.body.results[0].person).toEqual({
          _id: expect.any(String),
          name: 'Goku',
        });
        expect(res.body.results[1].text).toBe('Hi');
        expect(res.body.results[1].person).toEqual({
          _id: expect.any(String),
          name: 'Krillin',
        });
      });
  });

  test('should get documents when send parameter "distinct"', () => {
    return request(app)
      .get('/classes/Person')
      .query({ distinct: 'name' })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK)
      .then(async (res) => {
        expect(res.body.results).toEqual(['Goku', 'Krillin']);
      });
  });

  test('should count decuments', () => {
    return request(app)
      .get('/classes/Person')
      .query({ count: '1' })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.count).toEqual(res.body.results.length);
        expect(res.body.results[0].name).toEqual('Goku');
        expect(res.body.results[1].name).toEqual('Krillin');
      });
  });

  test('should count and not get documents', () => {
    return request(app)
      .get('/classes/Person')
      .query({ count: '1', limit: '0' })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.results).toEqual([]);
        expect(res.body.count).toEqual(2);
      });
  });

  test('should count with query', () => {
    return request(app)
      .get('/classes/Person')
      .query({
        where: JSON.stringify({ name: 'Goku' }),
        count: '1',
      })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK)
      .then(async (res) => {
        expect(res.body.results[0].name).toEqual('Goku');
        expect(res.body.count).toEqual(res.body.results.length);
      });
  });

  test('should report error class not match', () => {
    return request(app)
      .get('/classes/Test')
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect(httpStatus.NOT_FOUND);
  });
});

describe('POST /classes/:modelName', () => {
  test('should create document', () => {
    return request(app)
      .post('/classes/Person')
      .send({
        name: 'Vegeta',
        power: 9,
      })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.CREATED)
      .then((res) => {
        expect(res.body.name).toBe('Vegeta');
        expect(res.body.power).toBe(9);
      });
  });

  test('should error when invalid', () => {
    return request(app)
      .post('/classes/Person')
      .send({
        name: 'Vegeta',
        power: 'x',
      })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST)
      .then((res) => {
        expect(res.body.message).toBe('"power" must be a number');
      });
  });
});

describe('GET /classes/:modelName/:id', () => {
  test('should get document', async () => {
    const obj = await Person.findOne({});
    return request(app)
      .get(`/classes/Person/${obj._id}`)
      .set('Accept', 'application/json')
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.name).toBe(obj.name);
      });
  });

  test('should get document when send parameter "populate"', async () => {
    const obj = await Message.findOne({}).populate('person');
    return request(app)
      .get(`/classes/Message/${obj._id}`)
      .query({ populate: ['person'] })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.text).toBe(obj.text);
        expect(res.body.person.name).toBe(obj.person.name);
      });
  });

  test('should report error when id does not exists', () => {
    return request(app)
      .get('/classes/Person/abcdefg')
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.NOT_FOUND)
      .then((res) => {
        expect(res.body.message).toBe('Object not found.');
      });
  });
});

describe('PUT /classes/:modelName/:id', () => {
  test('should update people', async () => {
    const obj = await Person.findOne({});
    return request(app)
      .put(`/classes/Person/${obj._id}`)
      .send({ name: 'Vegeta', power: '9' })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.name).toBe('Vegeta');
        expect(res.body.power).toBe(9);
      });
  });

  test('should update people and query', async () => {
    const obj = await Message.findOne({}).populate('person');
    return request(app)
      .put(`/classes/Message/${obj._id}`)
      .query({ populate: 'person' })
      .send({ text: 'ok' })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body.text).toBe('ok');
        expect(res.body.person.name).toBe(obj.person.name);
      });
  });

  test('should error when invalid', async () => {
    const obj = await Person.findOne({});
    return request(app)
      .put(`/classes/Person/${obj._id}`)
      .send({ name: 'Vegeta', power: 'x' })
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.BAD_REQUEST)
      .then((res) => {
        expect(res.body.message).toBe('"power" must be a number');
      });
  });

  test('should report error when id does not exists', () => {
    return request(app)
      .put('/classes/Person/abcdefg')
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.NOT_FOUND)
      .then((res) => {
        expect(res.body.message).toBe('Object not found.');
      });
  });
});

describe('DELETE /classes/:modelName/:id', () => {
  test('should delete people', async () => {
    const obj = await Person.findOne({});
    await request(app)
      .delete(`/classes/Person/${obj._id}`)
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect(httpStatus.NO_CONTENT);

    await expect(Person.findById(obj._id)).resolves.toBeNull();
  });

  test('should report error when id does not exists', () => {
    return request(app)
      .delete('/classes/Person/abcdefg')
      .set('X-Session-Token', sessionToken)
      .set('X-API-Key', config.get('apiKey'))
      .expect('Content-Type', /json/)
      .expect(httpStatus.NOT_FOUND)
      .then((res) => {
        expect(res.body.message).toBe('Object not found.');
      });
  });
});
