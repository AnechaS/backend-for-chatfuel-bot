const modelController = require('./model.controller');

const c = Object.assign({}, modelController('User'));

/**
 * Get a user with session.
 */
c.me = (req, res) => res.json(req.user);

module.exports = c;