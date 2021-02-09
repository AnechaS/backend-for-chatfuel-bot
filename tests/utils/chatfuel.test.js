const fetch = require('node-fetch');
const { Response } = jest.requireActual('node-fetch');
const chatfuel = require('../../app/utils/chatfuel');

jest.mock('node-fetch');

afterEach(() => {
  fetch.mockReset();
});

describe('chatfuel', () => {
  test('should return correct', async () => {
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
    const result = await chatfuel.getUser('40738040699c7951');
    expect(fetch).toHaveBeenCalled();
    expect(result).toEqual({
      gender: 'female',
      firstName: 'asdf',
      profilePicUrl:
        'https://images.chatfuel.com/user/raw/103453611060507/5ebd4342bbcf1f26aec/profile.jpeg',
      lastName: 'jkl',
      messengerUserId: '40738040699c7951',
      region: 'กลาง',
      province: 'ปทุมธานี',
      name: 'ฟาเร',
      year: 'ก่อน 2561'
    });
  });

  test('should return undefind when id not exists', async () => {
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
    const result = await chatfuel.getUser('40738041159c7951');
    expect(fetch).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  test('should return error when parame empty', async () => {
    await expect(chatfuel.getUser()).rejects.toThrow();
  });

  test('should return error when request status not ok', async () => {
    fetch.mockReturnValue(
      Promise.resolve(
        new Response(
          JSON.stringify({
            result: {},
            success: false
          }),
          {
            status: 500
          }
        )
      )
    );
    await expect(chatfuel.getUser('40738041159c7951')).rejects.toThrow(
      'The People request on api chatfuel failed'
    );
    expect(fetch).toHaveBeenCalled();
  });
});
