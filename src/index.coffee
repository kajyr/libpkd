fsp = require 'fs-promise'
zlib = require 'zlib'

multiplex = (array, fn) -> Promise.all(fn item for item in array)

readJsonFile = (file) ->
	fsp
		.readFile(file, {encoding:'utf8'})
		.then(JSON.parse)

decompress = (data) ->
	new Promise( (resolve, reject) ->
		zlib.gunzip(data, (err, buf) ->
			return resolve buf.toString()
		)
	)

readZipFile = (file) ->
	fsp.readFile(file)
	.then(decompress)
	.then(JSON.parse)

readFile = (file) -> 
	return readJsonFile(file) if file.match(/json$/)
	return readZipFile(file) if file.match(/pkdata$/)

readFiles = (array_of_files) -> multiplex(array_of_files, readFile)

module.exports = {
	
	readFiles
	readFile
	
}