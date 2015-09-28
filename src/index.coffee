fsp = require 'fs-promise'
zlib = require 'zlib'

multiplex = (array, fn) -> Promise.all(fn item for item in array)

readJsonFile = (file) ->
	fsp
		.readFile(file, {encoding:'utf8'})
		.then(JSON.parse)

decode = (data) ->
	new Promise( (resolve, reject) ->
		zlib.gunzip(data, (err, buf) ->
			return resolve buf.toString()
		)
	)

encode = (json) ->
	new Promise (resolve, reject) -> zlib.gzip(json_data, (err, buf) -> resolve(buf))


readZipFile = (file) ->
	fsp.readFile(file)
	.then(decode)
	.then(JSON.parse)

readFile = (file) -> 
	return readJsonFile(file) if file.match(/json$/)
	return readZipFile(file) if file.match(/pkdata$/)

readFiles = (array_of_files) -> multiplex(array_of_files, readFile)

findFiles = (folder) ->
	fsp.readdir(folder)
		.then((files) -> files.filter( (name) -> return name.match(/\.[json|pkdata]/)? ) )

module.exports = {
	
	findFiles
	readFiles
	readFile
	encode
	
}