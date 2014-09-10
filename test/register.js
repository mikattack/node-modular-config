
var test = require('tap').test;


test('register', function (t) {
  var conf = require('../modular-config')
    , wrap = function () { return conf.register('invalid'); };
  
  t.throws(wrap, {
    name:    'Error',
    message: 'Invalid parser registration'
  });

  conf.register('csv', function () { /* no-op */ });
  t.equivalent(conf.extensions, ['toml', 'json', 'js', 'csv']);

  t.end();
});
