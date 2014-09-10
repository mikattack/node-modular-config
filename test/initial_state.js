
var test = require('tap').test;


test('initial state', function (t) {
  var conf = require('../modular-config')
  t.equal(typeof conf.load, 'function');
  t.equal(typeof conf.register, 'function');
  t.equivalent(conf.directory, process.cwd() + '/config');
  t.equivalent(conf.extensions, ['toml', 'json', 'js']);
  t.end();
});


test('property descriptors', function (t) {
  var conf = require('../modular-config')
    , desc;

  desc = Object.getOwnPropertyDescriptor(conf, 'load');
  t.equal(desc.enumerable, true);
  t.equal(desc.configurable, false);
  t.equal(typeof desc.value, 'function');

  desc = Object.getOwnPropertyDescriptor(conf, 'register');
  t.equal(desc.enumerable, true);
  t.equal(desc.configurable, false);
  t.equal(typeof desc.value, 'function');

  conf.directory = 'asdf';
  desc = Object.getOwnPropertyDescriptor(conf, 'directory');
  t.equal(desc.enumerable, true);
  t.equal(desc.configurable, false);
  t.equal(conf.directory, 'asdf');

  conf.supportedExtensions = 'asdf';
  desc = Object.getOwnPropertyDescriptor(conf, 'extensions');
  t.equal(desc.enumerable, true);
  t.equal(desc.configurable, false);
  t.equivalent(conf.extensions, ['toml', 'json', 'js']);

  t.end();
});
