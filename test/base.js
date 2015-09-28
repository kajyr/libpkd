var libpkd = require('../index.js')


exports.basicRW = function(test) {

	var json = {
		secret: 5
	};

	var str = JSON.stringify(json, null, 2);

	var path = './test/results/basicWrite.json';

	libpkd.writeFile(path, str, false).then(function() {
		libpkd.readFile(path).then(function(data) {
			test.equals(data.secret, json.secret);
			test.done();
		})
	})
};


exports.compressedRW = function(test) {

	var json = {
		secret: 43
	};

	var str = JSON.stringify(json, null, 2);

	var path = './test/results/basicWrite.pkdata';

	libpkd.writeFile(path, str).then(function() {
		libpkd.readFile(path).then(function(data) {
			test.equals(data.secret, json.secret);
			test.done();
		})
	})
};