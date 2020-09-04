const {SafeString} = require('handlebars');

module.exports = (value, safeValue) => {
  var out = value || safeValue;
  return new SafeString(out);
};