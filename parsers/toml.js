
var fs = require('fs')
  , toml = require('toml');


module.exports = function (path) {
  var src;

  try {
    src = fs.readFileSync(path, { encoding:'utf8' });
  } catch (e) {
    throw new Error('Cannot read configuration file: ' + path)
  }

  var data = toml.parse(src);
  src = null;

  return data;
};
