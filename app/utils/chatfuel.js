const fetch = require('node-fetch');
const camelCase = require('lodash/camelCase');
const config = require('config');

const URL = 'https://dashboard.chatfuel.com';
const BOT_ID = config.get('chatfuel.botId');
const TOKEN = config.get('chatfuel.token');

/**
 * Fetch user chatfuel by id
 * @param {String} id messenger user id
 * @return {Promise}
 */
exports.getUser = async function(id) {
  if (!id) {
    throw new Error('Parame is required');
  }

  const body = {
    parameters: [
      {
        name: 'messenger user id',
        values: [id],
        type: 'system'
      }
    ]
  };

  const resp = await fetch(`${URL}/api/bots/${BOT_ID}/users`, {
    method: 'POST',
    headers: {
      'content-type': ' application/json;charset=UTF-8',
      authorization: `Bearer ${TOKEN}`
    },
    body: JSON.stringify(body)
  }).then(response => {
    if (!response.ok) {
      throw new Error('The People request on api chatfuel failed');
    }

    return response.json();
  });

  if (!resp.success) {
    throw new Error('The People request on api chatfuel failed');
  }

  if (resp.result.count) {
    const fieldSelects = [
      'messenger user id',
      'first name',
      'last name',
      'gender',
      'profile pic url',
      'region',
      'province',
      'district',
      'name',
      'year'
    ];

    let user = resp.result.users[0];
    user = user.reduce((result, o) => {
      if (fieldSelects.includes(o.name)) {
        const key = camelCase(o.name);
        let value = o.values[0];
        if (key === 'year') {
          value = value.replace('b4', 'ก่อน');
        }
        result[key] = value;
      }

      return result;
    }, {});

    return user;
  }
};
