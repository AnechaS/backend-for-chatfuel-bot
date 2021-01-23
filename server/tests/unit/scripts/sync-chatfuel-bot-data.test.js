const mongoose = require('mongoose');
const config = require('config');
const syncChatfuelBotData = require('../../../scripts/sync-chatfuel-bot-data');
const cf = require('../../../utils/chatfuel');

const People = require('../../../models/people.model');

mongoose.Promise = Promise;
mongoose.connect(config.get('databaseURI'), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

beforeEach(async () => {
  await People.deleteMany();

  cf.getChatbotUsers = jest.fn().mockImplementation((filter, { offset }) => {
    const data = [
      {
        'messenger user id': '3000108692793781',
        'first name': 'fa',
        'last name': 'la',
        gender: 'male',
      },
      {
        'messenger user id': '3000108692793782',
        'first name': 'fb',
        'last name': 'lb',
        gender: 'male',
      },
      {
        'messenger user id': '3000108692793783',
        'first name': 'fc',
        'last name': 'lc',
        gender: 'male',
      },
      {
        'messenger user id': '3000108692793784',
        'first name': 'fd',
        'last name': 'ld',
        gender: 'male',
      },
      {
        'messenger user id': '3000108692793785',
        'first name': 'fe',
        'last name': 'le',
        gender: 'male',
      },
      {
        'messenger user id': '3000108692793786',
        'first name': 'ff',
        'last name': 'lf',
        gender: 'male',
      },
    ];

    const start = Math.max(offset - 1, 0);
    const end = start + 3;
    const results = data.slice(start, end);
    return Promise.resolve({
      total_count: data.length,
      count: data.length,
      results: results,
    });
  });
});

afterEach(() => {
  cf.getChatbotUsers.mockRestore();
});

afterAll(() => {
  mongoose.disconnect();
});

describe('sync-chatfuel-bot-data', () => {
  test('run success', async () => {
    await syncChatfuelBotData();

    const peoples = await People.find({});
    expect(peoples.length).toBe(6);
    expect(peoples[0]._id).toBe('3000108692793781');
    expect(peoples[1]._id).toBe('3000108692793782');
    expect(peoples[2]._id).toBe('3000108692793783');
    expect(peoples[3]._id).toBe('3000108692793784');
    expect(peoples[4]._id).toBe('3000108692793785');
    expect(peoples[5]._id).toBe('3000108692793786');
  });

  test('no cahtfuel bot info', async () => {
    cf.getChatbotUsers = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        total_count: 0,
        count: 0,
        results: []
      });
    });

    await syncChatfuelBotData();
  });

  test('failed to request chatfuel bot info', async () => {
    cf.getChatbotUsers = jest.fn().mockImplementation(() => {
      return Promise.reject(new Error('Request Failure Status 500'));
    });

    await syncChatfuelBotData();
  });

  test('failed sometime to request chatfuel bot info', async () => {
    cf.getChatbotUsers = jest.fn().mockImplementation((filters, { offset }) => {
      if (offset < 3) {
        return Promise.resolve({
          total_count: 6,
          count: 6,
          results: [
            {
              'messenger user id': '3000108692793781',
              'first name': 'fa',
              'last name': 'la',
              gender: 'male',
            },
            {
              'messenger user id': '3000108692793782',
              'first name': 'fb',
              'last name': 'lb',
              gender: 'male',
            },
            {
              'messenger user id': '3000108692793783',
              'first name': 'fc',
              'last name': 'lc',
              gender: 'male',
            },
          ],
        });
      }

      return Promise.reject(new Error('Request Failure Status 500'));
    });

    await syncChatfuelBotData();

    const peoples = await People.find({});
    expect(peoples.length).toBe(3);
    expect(peoples[0]._id).toBe('3000108692793781');
    expect(peoples[1]._id).toBe('3000108692793782');
    expect(peoples[2]._id).toBe('3000108692793783');
  });
});
