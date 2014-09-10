
var test = require('tap').test;


test('toml', function (t) {
  var path = process.cwd()
    , parser = require('../parsers/toml');

  if (path.indexOf('test') < 0) {
    path = path + '/test';
  }
  path = path + '/invalid.toml';
  
  var notFound = function () { parser('invalid'); }
    , invalid  = function () { parser(path); };

  t.throws(notFound, {
    name:    'Error',
    message: 'Cannot read configuration file: invalid'
  });

  t.throws(invalid, {
    name:    'SyntaxError',
    message: 'Expected "]" but "\\n" found.'
  });

  t.end();

});
