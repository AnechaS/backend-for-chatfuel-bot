const transform = doc => JSON.parse(JSON.stringify(doc));

module.exports = function(doc) {
  if (doc instanceof Array) {
    return doc.map(d => transform(d));
  }

  return transform(doc);
};
