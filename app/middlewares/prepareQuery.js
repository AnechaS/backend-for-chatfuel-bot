const { query } = require('express-validator');
const validator = require('./validator');

module.exports = function(fields) {
  let whitelist = [
    'distinct',
    'limit',
    'populate',
    'where',
    'select',
    'skip',
    'sort',
    'count'
  ];
  if (fields instanceof Array && fields.length) {
    whitelist = fields;
  }

  const validations = [];
  whitelist.forEach(field => {
    addValidation(validations, field);
  });

  return validator(validations);
};

function addValidation(validations, field) {
  switch (field) {
    case 'where': {
      const validate = query('where')
        .if(value => value)
        .isJSON()
        .customSanitizer(value => {
          return JSON.parse(value);
        });
      validations.push(validate);
      break;
    }

    case 'limit': {
      const validate = query('limit')
        .if(value => value)
        .isInt()
        .toInt();
      validations.push(validate);
      break;
    }

    case 'skip': {
      const validate = query('skip')
        .if(value => value)
        .isInt()
        .toInt();
      validations.push(validate);
      break;
    }

    case 'sort': {
      const validate = query('sort')
        .if(query('sort').isJSON())
        .customSanitizer(value => {
          return JSON.parse(value);
        });
      validations.push(validate);
      break;
    }

    case 'select': {
      const validate = query('select')
        .if(query('select').isJSON())
        .customSanitizer(value => {
          return JSON.parse(value);
        });
      validations.push(validate);
      break;
    }

    case 'populate': {
      const validate = query('populate')
        .if(query('populate').isJSON())
        .customSanitizer(value => {
          return JSON.parse(value);
        });
      validations.push(validate);
      break;
    }

    case 'count': {
      const validate = query('count')
        .if(value => value)
        .isIn(['0', '1'])
        .toInt();
      validations.push(validate);
      break;
    }
  }
}
