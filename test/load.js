
var test = require('tap').test;


test('load', function (t) {
  var conf = require('../modular-config')
    , dir  = process.cwd()
    , wrap = function () { return conf.load('invalid'); };

  if (dir.indexOf('test') === -1) {
    dir = dir + '/test';
  }
  
  t.throws(wrap, {
    name:    'Error',
    message: 'Cannot read configuration: Unsupported file type'
  });

  conf.directory = dir;

  var path = dir + '/config.json'
    , json = conf.load(path);
  path = path.replace('test/test', 'test');  // For coverage support
  t.equivalent(json, { 'test':{ 'message':'JSON, reporting in.' }});

  var toml = conf.load('config.toml');
  t.equivalent(toml, {
    'test': {
      'message':'Comments?  Whitespace?  TOML don\'t care.'
    }
  });

  var generic = conf.load('config', 'js');
  t.equivalent(generic, { 'test':{ 'message':'JSON, reporting in.' }});

  // From cache
  generic = require('../modular-config').load('config', 'js');
  t.equivalent(generic, { 'test':{ 'message':'JSON, reporting in.' }});

  // Configuration should be frozen
  generic.test = 'asdf';
  desc = Object.getOwnPropertyDescriptor(generic, 'test');
  t.equal(desc.configurable, false);
  t.inequal(generic.test, 'asdf');

  t.end();
});