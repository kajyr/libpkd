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
	new Promise (resolve, reject) -> zlib.gzip(json, (err, buf) -> resolve buf )

readZipFile = (file) ->
	fsp.readFile(file)
	.then(decode)
	.then(JSON.parse)

readFile = (file) -> 
	return readJsonFile(file) if file.match(/json$/)
	return readZipFile(file) if file.match(/pkdata$/)

readFiles = (array_of_files) -> _multiplex(array_of_files, readFile)

findFiles = (folder) ->
	fsp.readdir(folder)
		.then((files) -> files.filter( (name) -> return name.match(/\.[json|pkdata]/)? ) )

writeFile = (file, json, doEncode = true) ->
	str = _stringify(json)
	if doEncode
		return encode(str).then( (encodedData) -> fsp.writeFile(file, encodedData ) )
	else
		return fsp.writeFile(file, str, 'utf8')
	

module.exports = {
	
	findFiles
	readFiles
	readFile
	writeFile
	encode
	
}