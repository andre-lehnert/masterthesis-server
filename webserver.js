// ---------------- REST Server ------------------------------------------------
//
//
//



// ---------------- URL --------------------------------------------------------
var config = require('./.config').configuration;

// define url and port to concat REST-URLs
var BASEURL     = config.BASEURL,
    PORT        = config.PORT,
    URL         = BASEURL+':'+PORT;

module.exports.serverUrl = URL;

// ---------------- App --------------------------------------------------------

var express = require('express'),
    path = require('path'),

    // REST-API v1
    v1 = require('./src/v1/rest-api').api,
    // further versions: v2 = require('./src/v2/rest-api').api,

    // Express.js Application
    app = module.exports = express();

app.use(express.static(path.resolve(__dirname, 'client')));
app.set('_URL', URL);
app.set('_PORT', PORT);

// add the middleware to the stack
// app.use(org.express.oauth({
//   onSuccess: '/test/query',
//   onError: '/oauth/error'
// }));



// ---------------- Versions ---------------------------------------------------

/*
 * ## define the versions
 */
var VERSIONS =
{
  'href': URL+'/api',
  'versions': [
    v1
    // further versions
  ]
};

// ---------------- Routing ----------------------------------------------------

/*
 * ## ROOT
 */
app.get('/', function(req, res) {

    var API =
    {
      'echo' : 'HTML Output -> API Browser'
    };

    res.json(API);
})

/*
 * ## route to display versions
 */
app.get('/api', function(req, res) {
    res.json(VERSIONS);
})

/*
 * ## versioned routes go in the src/{version}/rest-api directory
 * - import the routes
 */
for (var k in VERSIONS.versions) {
    // e.g. ./src/v0/rest-api.js
    app.use(
      '/api/' + VERSIONS.versions[k].name,
      require('./src/' + VERSIONS.versions[k].name + '/rest-api')
    );
}

// ---------------- Run Application --------------------------------------------

var server = app.listen(PORT, function () {
    console.log("Listening on port %s...", server.address().port);
});
