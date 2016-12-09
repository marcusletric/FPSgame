var express = require('express');
var url = require("url");
var path = require("path");
var fs = require("fs");
const PORT = process.env.PORT;

var server = express();

server.use(handleRequest).listen(PORT);
require('./gameServer.js');

function commandSent(){
    update = true;
}

function handleRequest(request, response){
    if (request.method == 'GET') {
        var uri = url.parse(request.url).pathname
            , filename = path.join(process.cwd() + "/app/", uri);

        var contentTypesByExtension = {
            '.html': "text/html",
            '.css':  "text/css",
            '.js':   "text/javascript"
        };

        fs.exists(filename, function(exists) {
            if(!exists) {
                response.writeHead(404, {"Content-Type": "text/plain"});
                response.write( filename + "404 Not Found\n");
                response.end();
                return;
            }

            if (fs.statSync(filename).isDirectory()) filename += '/index.html';

            fs.readFile(filename, "binary", function(err, file) {
                if(err) {
                    response.writeHead(500, {"Content-Type": "text/plain"});
                    response.write(err + "\n");
                    response.end();
                    return;
                }

                var headers = {};
                var contentType = contentTypesByExtension[path.extname(filename)];
                if (contentType) headers["Content-Type"] = contentType;
                response.writeHead(200, headers);
                response.write(file, "binary");
                response.end();
            });
        });
    }
}