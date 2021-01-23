const { Seeder } = require('mongoose-data-seed');
const User = require('../models/user.model');

const data = [{
  email: 'root@email.com',
  password: 'dg7f8z11',
  name: 'administration',
  role: 'admin',
}];

class UsersSeeder extends Seeder {
  shouldRun() {
    return User.countDocuments().exec().then(count => count === 0);
  }

  run() {
    return User.create(data);
  }
}

module.exports = UsersSeeder;