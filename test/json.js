
var test = require('tap').test
  , fs = require('fs')
  , dir = process.cwd()
  , parser = require('../parsers/json');


if (dir.indexOf('test') < 0) {
  dir = dir + '/test';
}


test('json', function (t) {
  var data = fs.readFileSync(dir + '/config.json', { encoding:'utf8' })
    , invalid = function () { parser('invalid'); };

  t.throws(invalid, {
    name:    'Error',
    message: 'Invalid JSON file'
  });

  t.equivalent(parser(data), {
    'test': {
      'message':'JSON, reporting in.'
    }
  });

  t.end();

});
