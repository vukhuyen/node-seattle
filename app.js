var http = require('http')
	fs = require('fs');

var fileCache = {};

function handleRequest(req, res) {
	file = __dirname + req.url;
	if(fileCache[file]) {
		console.log('serving cached file');
		res.end(fileCache[file])
	} else {
		fs.readFile(file, function(err, data) {
			if(err) {
				res.end('file not found', 404)
			}
			console.log('serving new file');
			fs.watchFile(file, function(prev, curr) {
				if(prev.mtime != curr.mtime) {
					console.log('refreshing cache', file);
					delete fileCache[file];
				}
			});
			fileCache[file] = data;
			res.end(data);
		});
	}
}

http.createServer(handleRequest).listen(3000);
