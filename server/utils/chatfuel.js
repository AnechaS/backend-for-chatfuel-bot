const fetch = require('node-fetch');
const querystring = require('querystring');
const { startsWith, isEmpty, defaultsDeep } = require('lodash');
const config = require('config');

const CHATFUEL_HOST = 'https://dashboard.chatfuel.com';
const CHATFUEL_BOT_ID = config.get('chatfuel.botId');
const CHATFUEL_API_TOKEN = config.get('chatfuel.token');

function request(pathname, options) {
  let qs;
  if (Object(options).hasOwnProperty('params')) {
    qs = querystring.stringify(options.params);
    delete options.params;
  }

  let url = CHATFUEL_HOST + '/api/bots/' + CHATFUEL_BOT_ID;
  url += startsWith(pathname, '/') ? pathname : '/' + pathname;
  url += !isEmpty(qs) ? '?' + qs : '';

  options = defaultsDeep(options, {
    headers: {
      authorization: `Bearer ${CHATFUEL_API_TOKEN}`,
    },
  });

  return fetch(url, options).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP Error Response: ${response.status}`);
    }

    return response.json();
  });
}

/**
 * Get Users.
 * @param {{operation:string, parameters:Array}} filters
 * @param {Object} parameters url parameter
 * @returns {Promise} { result: { total_coun: number, count: number, users: array }}
 * @example
 * getUsers({
 *  operation:"or",
 *  parameters: [{ name: 'messenger user id', values: ['string'], operation: 'is' }]
 * });
 *
 * getUsers({
 *  operation:"or",
 *  parameters: [{ name: 'messenger user id', values: ['string'], operation: 'is' }]
 * }, {
 *  desc: true,
 *  offset: 1
 * });
 */

async function getChatbotUsers(filters = {}, parameters) {
  let params = Object.assign({}, parameters);
  if (Object(params).hasOwnProperty('desc') && params.desc) {
    params.sort = 'updated_date';
  }

  let body = filters;
  if (!Object.keys(filters).length) {
    body = { parameters: [] };
  }

  const response = await request('/users', {
    params,
    method: 'POST',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(body),
  }).then((response) => response.result);

  const obj = {
    total_count: response.total_count,
    count: response.count,
    results: [],
  };

  if (!response.count) {
    return obj;
  }

  obj.results = response.users.map((user) => {
    return user.reduce((result, object) => {
      const { name, values, type } = object;
      const value = values.length > 1 ? values : values[0];

      if (type === 'custom') {
        if (!result['customAttributes']) {
          result['customAttributes'] = { [name]: value };
        } else {
          result['customAttributes'][name] = value;
        }
      } else {
        result[name] = value;
      }

      return result;
    }, {});
  });

  return obj;
}

/**
 * Get user chatfuel by id
 * @param {String} id messenger user id
 * @param {Object} options url params
 * @return {Promise}
 *
 * @example
 * getUser('messenger user id')
 */
async function getChatbotUser(id) {
  if (!id) {
    throw new Error('id is required');
  }

  const filters = {
    parameters: [
      {
        name: 'messenger user id',
        values: [id],
        type: 'system',
        operation: 'is',
      },
    ],
  };

  const response = await getChatbotUsers(filters);
  if (!response.count) {
    return;
  }

  return response.results[0];
}

/**
 * Get statistics.
 * @param {String} path API paths
 * @param {Object} parameters url parameter
 * @return {Promise}
 * @example
 * getStats('total_users')
 * getStats('total_users', {start_date: '2020-01-01-', end_date: '2020-02-01'})
 */
async function getStats (path, parameters) {
  if (!path || typeof path !== 'string') {
    throw new Error('statistics api path is invalid');
  }

  const params = Object.assign({}, parameters);
  // TODO: Usage fetch streams.
  const response = await request(`/yandex/stats/${path}`, {
    params,
    method: 'GET',
  });

  return response.result || {};
}

const matchModelPaths = chatbotUser => ({
  id: chatbotUser['messenger user id'],
  firstname: chatbotUser['first name'],
  lastname: chatbotUser['last name'],
  gender: chatbotUser['gender'],
  pic: chatbotUser['profile pic url'],
});

module.exports = {
  request,
  getChatbotUsers,
  getChatbotUser,
  getStats,
  matchModelPaths
};
