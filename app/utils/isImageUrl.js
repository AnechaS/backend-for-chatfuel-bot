const urlParse = require('url').parse;
const isImage = require('is-image');
const isUrl = require('is-url');

module.exports = function(url) {
  if (!url) return false;
  const http = url.lastIndexOf('http');
  if (http != -1) url = url.substring(http);
  if (!isUrl(url)) return isImage(url);
  let pathname = urlParse(url).pathname;
  if (!pathname) return false;
  const last = pathname.search(/[:?&]/);
  if (last != -1) pathname = pathname.substring(0, last);
  if (isImage(pathname)) return true;
};
