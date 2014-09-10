
var fs = require('fs')
  , toml = require('toml');


module.exports = function (input) {
  try {
    var data = toml.parse(input);
    src = null;
    return data;
  } catch (e) {
    var ParseError = new Error('Invalid TOML file');
    ParseError.parseError = e.message;
    throw ParseError;
  }
};
