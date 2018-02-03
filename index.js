var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');

var sslOptions = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
    passphrase:'1234'
  };

var server = express();
server.use(express.static('./'));
http.createServer(server).listen(8080);
//https.createServer(sslOptions, server).listen(8443)
