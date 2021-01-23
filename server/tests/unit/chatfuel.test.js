const fetch = require('node-fetch');
const { Response } = jest.requireActual('node-fetch');
const cf = require('../../utils/chatfuel');

jest.mock('node-fetch');

describe('chatfuel', () => {
  afterEach(() => {
    fetch.mockReset();
  });

  describe('request', () => {
    test('should request success', async () => {
      fetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify({}))));

      cf.request('/test', { params: { x: 'x' } });
      expect(fetch).toHaveBeenCalled();
    });

    test('should request failure', async () => {
      fetch.mockReturnValue(
        Promise.resolve(new Response(JSON.stringify({}), { status: 400 }))
      );

      const res = cf.request('/test', { params: { x: 'x' } });

      await expect(res).rejects.toThrow();
      expect(fetch).toHaveBeenCalled();
    });
  });

  describe('getChatbotUsers', () => {
    test('should return users', async () => {
      fetch.mockReturnValue(
        Promise.resolve(
          new Response(
            JSON.stringify({
              result: {
                total_count: 2,
                count: 2,
                users: [
                  [
                    {
                      type: 'system',
                      name: 'gender',
                      values: ['male'],
                      count: 0,
                    },
                    {
                      type: 'system',
                      name: 'first name',
                      values: ['son'],
                      count: 0,
                    },
                    {
                      type: 'system',
                      name: 'last name',
                      values: ['goku'],
                      count: 0,
                    },
                    {
                      type: 'system',
                      name: 'messenger user id',
                      values: ['3000108692793780'],
                      count: 0,
                    },
                    {
                      type: 'system',
                      name: 'status',
                      values: ['reachable'],
                      count: 0,
                    },
                    {
                      type: 'custom',
                      name: 'text',
                      values: ['Hi'],
                      count: 0,
                    },
                    {
                      type: 'custom',
                      name: 'status',
                      values: ['1'],
                      count: 0,
                    },
                  ],
                  [
                    {
                      type: 'system',
                      name: 'gender',
                      values: ['male'],
                      count: 0,
                    },
                    {
                      type: 'system',
                      name: 'first name',
                      values: ['son'],
                      count: 0,
                    },
                    {
                      type: 'system',
                      name: 'last name',
                      values: ['gohan'],
                      count: 0,
                    },
                    {
                      type: 'system',
                      name: 'messenger user id',
                      values: ['3000108692793781'],
                      count: 0,
                    },
                    {
                      type: 'system',
                      name: 'status',
                      values: ['reachable'],
                      count: 0,
                    },
                    {
                      type: 'custom',
                      name: 'text',
                      values: ['Hello'],
                      count: 0,
                    },
                  ],
                ],
              },
              success: true,
            })
          )
        )
      );

      const response = await cf.getChatbotUsers({});
      expect(fetch).toHaveBeenCalled();
      expect(response).toEqual({
        total_count: 2,
        count: 2,
        results: [
          {
            'messenger user id': '3000108692793780',
            'first name': 'son',
            'last name': 'goku',
            gender: 'male',
            status: 'reachable',
            customAttributes: {
              text: 'Hi',
              status: '1',
            },
          },
          {
            'messenger user id': '3000108692793781',
            'first name': 'son',
            'last name': 'gohan',
            gender: 'male',
            status: 'reachable',
            customAttributes: {
              text: 'Hello',
            },
          },
        ],
      });
    });
  });

  describe('getChatbotUser', () => {
    test('should return user', async () => {
      fetch.mockReturnValue(
        Promise.resolve(
          new Response(
            JSON.stringify({
              result: {
                total_count: 2,
                count: 1,
                users: [
                  [
                    {
                      type: 'system',
                      name: 'gender',
                      values: ['male'],
                      count: 0,
                    },
                    {
                      type: 'system',
                      name: 'first name',
                      values: ['son'],
                      count: 0,
                    },
                    {
                      type: 'system',
                      name: 'last name',
                      values: ['goku'],
                      count: 0,
                    },
                    {
                      type: 'system',
                      name: 'messenger user id',
                      values: ['3000108692793780'],
                      count: 0,
                    },
                    {
                      type: 'system',
                      name: 'status',
                      values: ['reachable'],
                      count: 0,
                    },
                    {
                      type: 'custom',
                      name: 'text',
                      values: ['Hi'],
                      count: 0,
                    },
                    {
                      type: 'custom',
                      name: 'status',
                      values: ['1'],
                      count: 0,
                    },
                  ],
                ],
              },
              success: true,
            })
          )
        )
      );

      const user = await cf.getChatbotUser('3000108692793780');
      expect(fetch).toHaveBeenCalled();
      expect(user).toEqual({
        'messenger user id': '3000108692793780',
        'first name': 'son',
        'last name': 'goku',
        gender: 'male',
        status: 'reachable',
        customAttributes: {
          text: 'Hi',
          status: '1',
        },
      });
    });

    test('should return undefined when user not found', async () => {
      fetch.mockReturnValue(
        Promise.resolve(
          new Response(
            JSON.stringify({
              result: {
                total_count: 2,
                count: 0,
                users: [],
              },
            })
          )
        )
      );

      const user = await cf.getChatbotUser('abcd');
      expect(fetch).toHaveBeenCalled();
      expect(user).toBeUndefined();
    });
  });

  describe('getStats', () => {
    test('should get statistics', async () => {
      fetch.mockResolvedValue(
        new Response(
          JSON.stringify({
            result: {
              x: ['2020-11-23', '2020-11-24'],
              y: {
                'Total New users': [0, 0],
                'New Blocked users': [0, 0],
                'Total users': [49, 50],
                'Blocked users': [17, 17],
              },
            },
            success: true,
          })
        )
      );

      const totalChatbotUser = await cf.getStats('total_users');
      expect(fetch).toHaveBeenCalled();
      expect(totalChatbotUser).toEqual({
        x: ['2020-11-23', '2020-11-24'],
        y: {
          'Total New users': [0, 0],
          'New Blocked users': [0, 0],
          'Total users': [49, 50],
          'Blocked users': [17, 17],
        },
      });
    });
  });
});
