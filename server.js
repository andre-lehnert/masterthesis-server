//
// # Application
//
//
//
var express = require('express');
var path = require('path');


// ## SimpleServer
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
//var router = express();
//var server = http.createServer(router);
var app = module.exports = express();

app.use(express.static(path.resolve(__dirname, 'client')));

// ## REST-SERVICE
//
// define the versions
var VERSIONS = { 'Version 1': '/v1' }; //, 'Version 1': '/v1'};

// define url and port to concat REST-URLs
var URL     = 'http://localhost/',
    PORT    = 80;

//console.log(process.env.IP);
//console.log(process.env.PORT);

app.set('_URL', URL);
app.set('_PORT', PORT);



// ## Client
//
// route to angular material prototype

// route to display versions
app.get('/api/versions', function(req, res) {
    res.json(VERSIONS);
})

// ## Server
//
// versioned routes go in the src/{version}/rest-api directory
// import the routes
for (var k in VERSIONS) {
    // e.g. ./server/routes/rest-api/v0/api.js
    app.use('/api' + VERSIONS[k], require('./src' + VERSIONS[k] + '/rest-api'));
}



var server = app.listen(PORT, function () {
    console.log("Listening on port %s...", server.address().port);
});
