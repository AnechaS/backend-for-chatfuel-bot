exports.docToJSON = function(doc) {
  const transform = doc => JSON.parse(JSON.stringify(doc));
  if (doc instanceof Array) {
    return doc.map(d => transform(d));
  }

  return transform(doc);
};
