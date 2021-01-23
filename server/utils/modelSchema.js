const { models } = require('mongoose');

module.exports = function (modelName) {
  if (!models[modelName]) {
    return;
  }

  const { schema } = models[modelName];
  const fields = Object.keys(schema.paths).reduce((result, fieldName) => {
    const path = schema.paths[fieldName].options;
    const type = typeof path.type === 'function' ? path.type.name : path.type;
    const field = { type };
    if (type === 'objectId' && path.ref) {
      field.ref = path.ref;
    }

    result[fieldName] = field;
    return result;
  }, {});

  return {
    className: modelName,
    fields,
  };
};
