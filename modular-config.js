
/* 
 * Parses and caches files as configuration objects.
 * 
 * Reads a configuration file as defined by the input parameter and
 * parses it in the format indicated by its extension (if supported).
 * The data is then cached and made available from the module as an
 * object with properties.
 * 
 * All subsequent requests for the file result in the cached data.
 * 
 * Configurations are effectively read-once.
 * 
 * Parsed configurations are immutable.
 * 
 * Configurations are stored in-memory.  Very large configurations
 * may cause problems (at the parsing and storage stages).
 * 
 * Files may be loaded by absolute path or by file name with
 * extension.  In the latter case, configurations are expected to
 * reside in predefined directory.  This directory may be
 * configured with `setDefaultDirectory()`, but defaults to:
 * 
 *    process.cwd() + '/config'
 * 
 * 
 * SUPPORTED FORMATS
 * 
 *    TOML - ".toml" extension
 *    JSON - ".json" extension
 * 
 *    Additional format parsers may be registered at run time.
 * 
 * 
 * ERRORS:
 * 
 * All errors will throw exceptions.
 * 
 * Errors typically fall into two categories:
 * 
 *   - File read errors
 *   - File parse errors
 * 
 * 
 * EXAMPLE USAGE:
 * 
 *   With the following files
 *    - process.cwd()/config/confA.toml
 *    - process.cwd()/config/confB.json
 *    - /path/to/file.toml
 * 
 *    var conf = require('modular-config')
 *      , confA = require('modular-config').load('confA.toml')
 *      , confB = conf.load('confB.json')
 *      , confC = require('modular-config').load('/path/to/file.toml')
 */


var cache = { }
  , deepfreeze = require('deep-freeze')
  , defaultDir = process.cwd() + '/config'
  , fs = require('fs')
  , resolve = require('path').resolve
  , util = require('util');


// Default supported file formats, based on extension
var parsers = {   // Order significant
      'toml': require('./parsers/toml'),
      'json': require('./parsers/json'),
      'js':   require('./parsers/json')}
  , extensions = Object.keys(parsers);


/* 
 * Load a file and attempt to parse it as a configuration object.
 * 
 * If no extension is provided the by the file name and `parserName` is
 * not defined, the function will attempt to look for files named
 * similarly, but with an extension.
 * 
 * Examples:
 * 
 *  'application'   -> application(.toml|.json)
 *  '/path/to/file' -> /path/to/file(.toml|.json)
 */
function load (path, parserName) {
  var ext = null;
  parserName = parserName || '';
  if (path.indexOf('/') === -1) {
    path = defaultDir + '/' + path;
  }

  if (cache[path]) {
    return cache[path];
  }

  var lindex = path.lastIndexOf('.');
  if (lindex === -1) {
    ext = (parserName.length)
      ? parserName
      : null;
  } else {
    ext = path.substr(lindex + 1);
  }

  if (! ext || ! parsers[ext]) {
    throw new Error('Cannot read configuration: Unsupported file type');
  } else {
    try {
      var raw = fs.readFileSync(path, { encoding:'utf8' });
      cache[path] = parsers[ext](raw);
      deepfreeze(cache[path]);
    } catch (e) {
      throw new Error('Cannot read configuration file: ' + path)
    }
  }

  return cache[path];
}


/* 
 * Registers a parser to handle reading files of a particular extension.
 * 
 *  [string] extension    File extension that the parser will handle.
 *                        Existing parsers may be overridden.  Should not
 *                        include a dot.
 *  [function] parser     Function to parse a file from a given path into
 *                        an object.  It's responsible for reading the
 *                        file, returning the parsed object upon success,
 *                        or throwing an exception on failure.
 */
function register (extension, parser) {
  if (typeof parser === 'function') {
    parsers[extension] = parser;
    extensions = Object.keys(parsers);
  } else {
    throw new Error('Invalid parser registration');
  }
}


var api = { };
Object.defineProperty(api, 'load', {
  enumerable: true,
  value: load
});
Object.defineProperty(api, 'register', {
  enumerable: true,
  value: register
});
Object.defineProperty(api, 'directory', {
  enumerable: true,
  get: function () { return defaultDir; },
  set: function (path) { defaultDir = path; }
});
Object.defineProperty(api, 'extensions', {
  enumerable: true,
  get: function () { return extensions; },
  set: undefined
});


module.exports = api;
