(function() {
  var decompress, fsp, multiplex, readFile, readFiles, readJsonFile, readZipFile, zlib;

  fsp = require('fs-promise');

  zlib = require('zlib');

  multiplex = function(array, fn) {
    var item;
    return Promise.all((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = array.length; i < len; i++) {
        item = array[i];
        results.push(fn(item));
      }
      return results;
    })());
  };

  readJsonFile = function(file) {
    return fsp.readFile(file, {
      encoding: 'utf8'
    }).then(JSON.parse);
  };

  decompress = function(data) {
    return new Promise(function(resolve, reject) {
      return zlib.gunzip(data, function(err, buf) {
        return resolve(buf.toString());
      });
    });
  };

  readZipFile = function(file) {
    return fsp.readFile(file).then(decompress).then(JSON.parse);
  };

  readFile = function(file) {
    if (file.match(/json$/)) {
      return readJsonFile(file);
    }
    if (file.match(/pkdata$/)) {
      return readZipFile(file);
    }
  };

  readFiles = function(array_of_files) {
    return multiplex(array_of_files, readFile);
  };

  module.exports = {
    readFiles: readFiles,
    readFile: readFile
  };

}).call(this);
