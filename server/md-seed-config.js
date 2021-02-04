const mongoose = require('mongoose');
const config = require('config');

const Users = require('./seeders/users.seeder');

/**
 * Seeders List
 * order is important
 * @type {Object}
 */
exports.seedersList = {
  Users,
};

/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
exports.connect = function () {
  return mongoose.connect(config.get('databaseURI'), { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
};

/**
 * Drop/Clear the database implementation
 * @return {Promise}
 */
exports.dropdb = function () {
  return mongoose.connection.db.dropDatabase();
};
