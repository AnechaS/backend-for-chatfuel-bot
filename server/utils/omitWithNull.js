const { isUndefined, isNaN, isNull } = require('lodash');

/**
 * validate rule
 * @param {any}
 * @return {Boolean}
 */
function rule(value) {
  return (
    isUndefined(value) ||
    isNaN(value) ||
    isNull(value) ||
    value === '' ||
    value === 'null'
  );
}

/**
 * Remove prop object with null
 * @param {Object}
 * @return {Object}
 */
function omitWithNull(object) {
  const result = Object.keys(object).reduce((result, value) => {
    const o = object[value];
    if (!rule(o) && typeof o === 'object' && Object.keys(o).length) {
      result[value] = omitWithNull(o);
    } else if (!rule(o)) {
      result[value] = o;
    }

    return result;
  }, {});
  return result;
}

module.exports = omitWithNull;
