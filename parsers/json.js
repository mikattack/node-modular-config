
var fs = require('fs');


module.exports = function (path) {
  try {
    var src = fs.readFileSync(path, { encoding:'utf8' });
  } catch (e) {
    throw new Error('Cannot read configuration file: ' + path)
  }

  var data = JSON.parse(src);
  src = null;
  return data;
};
