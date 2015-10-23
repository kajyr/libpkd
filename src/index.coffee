fsp = require 'fs-promise'
zlib = require 'zlib'

_multiplex = (array, fn) -> Promise.all(fn item for item in array)
_stringify = (json) -> JSON.stringify(json, null, 2)

readJsonFile = (file) ->
	fsp
		.readFile(file, {encoding:'utf8'})
		.then(JSON.parse)

decode = (data) ->
	new Promise (resolve, reject) -> zlib.gunzip(data, (err, buf) -> resolve buf.toString() )

encode = (json) ->
	str = _stringify(json)
	new Promise (resolve, reject) -> zlib.gzip(str, (err, buf) -> resolve buf )

readZipFile = (file) ->
	fsp.readFile(file)
	.then(decode)
	.then(JSON.parse)

readFile = (file) ->
	return readJsonFile(file) if file.match(/json$/)
	return readZipFile(file) if file.match(/pkdata$/)

readFiles = (array_of_files) -> _multiplex(array_of_files, readFile)

findFiles = (folder, filter = /\.[json|pkdata]/) ->
	fsp.readdir(folder)
		.then((files) -> files.filter( (name) -> name.match(filter)? ) )
		.then((files) -> files.map( (name) -> "#{folder}/#{name}" ))

writeFile = (file, json, doEncode = true) ->
	if doEncode
		return encode(json).then( (encodedData) -> fsp.writeFile(file, encodedData ) )
	else
		return fsp.writeFile(file, _stringify(json), 'utf8')


module.exports = {

	findFiles
	readFiles
	readFile
	writeFile
	encode

}
