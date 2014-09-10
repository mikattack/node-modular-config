
var fs = require('fs');


module.exports = function (input) {
  try {
    var data = JSON.parse(input);
    src = null;
    return data;
  } catch (e) {
    var ParseError = new Error('Invalid JSON file');
    ParseError.parseError = e.message;
    throw ParseError;
  }
};
