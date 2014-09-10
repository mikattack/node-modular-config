
var test = require('tap').test;


test('json', function (t) {
  var dir = process.cwd()
    , parser = require('../parsers/json')
    , notFound = function () { parser('invalid'); };

  if (dir.indexOf('test') < 0) {
    dir = dir + '/test';
  }

  t.throws(notFound, {
    name:    'Error',
    message: 'Cannot read configuration file: invalid'
  });

  t.end();

});
