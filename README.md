# modular-config

A simplistic library for synchronously loading read-only configurations from
a variety of file formats.

For many projects, the [config](https://github.com/lorenwest/node-config)
library is sufficient for all configuration needs.  But if you like other
formats beyond JSON, or prefer less automatic loading behavior, this
package offers another path.  Initially supporting TOML and JSON, other
formats can be added by just registering a parser.


## Usage

```
npm install modular-config
```

```
// Without an absolute path, process.cwd() + '/config' assumed
var configA = require('modular-config').load('configA.toml');

// Absolute paths may also be used
var configB = require('modular-config').load('/path/to/configC');

// Or you can set another configuration search directory
var conf = require('modular-config');
conf.directory('/var/tmp');
var configC = conf.load('oddly_placed.toml');

// Enable YAML config parsing
var yaml = require('js-yaml');

conf.register('yaml', function (path) {
  try {
    var data = yaml.safeLoad(fs.readFileSync(path, 'utf8'));
  } catch (e) {
    throw new Error('Cannot read configuration file: ' + path);
  }
  return data;
});

var configd = require('modular-config').load('configD.yaml');
```
