(function() {
  var decode, encode, findFiles, fsp, multiplex, readFile, readFiles, readJsonFile, readZipFile, writeFile, zlib;

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

  decode = function(data) {
    return new Promise(function(resolve, reject) {
      return zlib.gunzip(data, function(err, buf) {
        return resolve(buf.toString());
      });
    });
  };

  encode = function(json) {
    return new Promise(function(resolve, reject) {
      return zlib.gzip(json_data, function(err, buf) {
        return resolve(buf);
      });
    });
  };

  readZipFile = function(file) {
    return fsp.readFile(file).then(decode).then(JSON.parse);
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

  findFiles = function(folder) {
    return fsp.readdir(folder).then(function(files) {
      return files.filter(function(name) {
        return name.match(/\.[json|pkdata]/) != null;
      });
    });
  };

  writeFile = function(file, data, doEncode) {
    if (doEncode == null) {
      doEncode = true;
    }
    if (doEncode) {
      return encode.then(function(encodedData) {
        return fsp.writeFile(file, encodedData);
      });
    } else {
      return fsp.writeFile(file, data, 'utf8');
    }
  };

  module.exports = {
    findFiles: findFiles,
    readFiles: readFiles,
    readFile: readFile,
    writeFile: writeFile,
    encode: encode
  };

}).call(this);
