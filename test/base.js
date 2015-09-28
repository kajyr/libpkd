var libpkd = require('../index.js')


exports.basicWrite = function(test) {

	var json = {
		secret: 5
	};

	var str = JSON.stringify(json, null, 2);

	libpkd.writeFile('./test/fixture/basicWrite', str, false).then(function() {
		test.done();
	})
};
