
var test = require('tap').test
  , fs = require('fs')
  , dir = process.cwd()
  , parser = require('../parsers/toml');


if (dir.indexOf('test') < 0) {
  dir = dir + '/test';
}


test('toml', function (t) {
  var data = fs.readFileSync(dir + '/config.toml', { encoding:'utf8' })
    , invalid = function () { parser('invalid'); };

  t.throws(invalid, {
    name:    'Error',
    message: 'Invalid TOML file'
  });

  t.equivalent(parser(data), {
    'test': {
      'message':'Comments?  Whitespace?  TOML don\'t care.'
    }
  });

  t.end();

});
