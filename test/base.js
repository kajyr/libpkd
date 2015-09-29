var libpkd = require('../index.js')


exports.basicRW = function(test) {

	var json = { secret: 5 };

	//var str = JSON.stringify(json, null, 2);

	var path = './test/results/basicWrite.json';

	libpkd.writeFile(path, json, false).then(function() {
		libpkd.readFile(path).then(function(data) {
			test.equals(data.secret, json.secret);
			test.done();
		});
	});
};


exports.compressedRW = function(test) {

	var json = { secret: 43 };

	var path = './test/results/basicWrite.pkdata';

	libpkd.writeFile(path, json).then(function() {
		libpkd.readFile(path).then(function(data) {
			test.equals(data.secret, json.secret);
			test.done();
		});
	});
};

exports.findFiles = function(test) {

	var folder = './test/fixtures';

	libpkd.findFiles(folder).then(function(files) {
		test.equals(2, files.length);
		test.done();
	});
};
exports.findFilesFiltered = function(test) {

	var folder = './test/fixtures';

	libpkd.findFiles(folder, /\d{8}\./).then(function(files) {
		test.equals(1, files.length);
		test.done();
	})
};