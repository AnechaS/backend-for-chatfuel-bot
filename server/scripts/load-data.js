const mongoose = require('mongoose');
const config = require('config');
const cf = require('../utils/chatfuel');

const People = require('../models/people.model');

mongoose.Promise = Promise;
if (module.children.length) {
  mongoose.connect(config.get('databaseURI'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
}

async function main() {
  let count = 0;
  let offset = 1;
  let size = 0;
  let promises = [];

  process.stdout.write('Load chatfuel bot info...\n');

  do {
    try {
      let response = await cf.getChatbotUsers({},
        {
          desc: true,
          sort: 'updated_date',
          offset,
        }
      );
      let chatbotUsers = response.results;
      if (!chatbotUsers.length) {
        break;
      }

      if (!count && !size && response.total_count) {
        count = response.total_count;
        size = chatbotUsers.length;
      }

      // match data
      chatbotUsers.forEach((chatbotUser) => {
        let { id, ...object } = cf.matchModelPaths(chatbotUser);
        let people = People.findByIdAndUpdate(id, object, {
          upsert: true,
          new: true,
        });

        promises.push(people);
      });
    
    } catch (error) {
      process.stdout.write('Error: ' + error.message + '\n');
    } finally {
      offset += size;
    }
  } while (offset < count);

  if (promises.length) {
    process.stdout.write('Save to database...\n');
    await Promise.all(promises);
  }

  process.stdout.write('Done.\n');

  if (module.children.length) {
    await mongoose.disconnect();
    process.exit(0);
  }
}

!module.children.length ? (module.exports = main) : main();
