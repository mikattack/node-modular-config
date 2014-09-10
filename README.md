# modular-config

A simplistic library for synchronously loading read-only configurations from
a variety of file formats.

For many projects, the [config](https://github.com/lorenwest/node-config)
library is sufficient for all configuration needs.  But if you like other
formats beyond JSON, or prefer less automatic loading behavior, this
package offers another path.


## Usage

```
npm install modular-config
```

```
// With just a file name, lookups will occur at process.cwd() + '/config'
var configA = require('modular-config').load('application.toml');


// Absolute paths are supported
var configB = require('modular-config').load('/path/to/file.json');


// Or you can set another configuration search directory
var conf = require('modular-config');
conf.directory('/var/tmp');
var configC = conf.load('oddly_placed.toml');


// File extensions are required unless you specify a parser
var configD = require('modular-config').load('generic', 'toml');
```


## How It Works

This library is structured on the idea that all configurations will be read from disk
synchronously at application start time.  This is often an acceptable assumption, since many 
things won't happen until configuration information is available.

When a configuration is successfully loaded, it is turned into an object tree, made read-only,
cached, then returned.  Subsequent requests for the same file will returned the previously
parsed configuration.  This means that configurations cannot be reloaded without restarting
the application.

Configuration files may be loaded with an absolute file path or by file name in a
configurable lookup directory (which defaults to `process.cwd() + '/config'`).

All errors throw exceptions.  Though this is a bit extreme, it fits with the use-case
of upfront loading.  If configuration information isn't available, it is assumed that
the application cannot reasonably start.

Out of the box, TOML (`.toml`) and JSON (`.json`, `.js`) configuration formats are
supported.  Other formats may easily be added via the `register()` function.  An
extension and parser function must be supplied, with the latter returning the parsed
object (from raw string input).

```
// Enable YAML config parsing
var conf = require('modular-config')
  , yaml = require('js-yaml');

conf.register('yaml', function (input) {
  try {
    return yaml.safeLoad(input);
  } catch (e) {
    throw new Error('Cannot parse YAML configuration file');
  }
});

var configd = require('modular-config').load('configD.yaml');
```

Existing parsers may be overridden on a per-extension basis.  However, remember that
the parsing results are cached, so any new parsers _must_ return an object tree.
Trying to be fancy by returning a Promise (or similar) can result in unexpected
behavior.
