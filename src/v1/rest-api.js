// ---------------- Router for API v1 ------------------------------------------

// ---------------- VERSION ----------------------------------------------------

var version         = 1,
    name            = 'v'+version;

module.exports.version = version;
module.exports.name = name;

// -----------------------------------------------------------------------------

var express = require('express'),
    // Server
    server = require('./../../webserver'),
    URL = server.serverUrl,
    // Express.js Application
    app = module.exports = express();

// ---------------- API --------------------------------------------------------

// ## OPERATION
var OPERATIONS =
{
    'move': '/move',
    'light': '/light',
    'animation': '/animation',
    'status': '/status',
    'apps': '/apps',
    'bars': '/bars',
    'tokens': '/tokens',
    'animations': '/animations',
    'devices': '/devices',
    'smartphones': '/smartphones',
    'notifications': '/notifications',
    'invocations': '/invocations',
    'sides': '/sides',
    'activations': '/activations',
    'sequences': '/sequences'
    // more operations and /operations/js-files
};

var API =
{
  'href': URL+'/api/'+name,
  'name': name,
  'operations': [
    // Debugging API v2
    URL+'/api/' + name + OPERATIONS.move,
    URL+'/api/' + name + OPERATIONS.light,
    URL+'/api/' + name + OPERATIONS.animation,
    URL+'/api/' + name + OPERATIONS.status,
    // Production API v3
    URL+'/api/' + name + OPERATIONS.apps,
    URL+'/api/' + name + OPERATIONS.bars,
    URL+'/api/' + name + OPERATIONS.tokens,
    URL+'/api/' + name + OPERATIONS.animations,
    URL+'/api/' + name + OPERATIONS.devices,
    URL+'/api/' + name + OPERATIONS.smartphones,
    URL+'/api/' + name + OPERATIONS.notifications,
    URL+'/api/' + name + OPERATIONS.invocations,
    URL+'/api/' + name + OPERATIONS.sides,
    URL+'/api/' + name + OPERATIONS.activations,
    URL+'/api/' + name + OPERATIONS.sequences,
  ]
};

module.exports.api = API;

// ---------------- ROUTING ----------------------------------------------------

/*
 * ## shows API information
 */
app.get('/', function(req, res) {
    res.json(API);
});

var urlOperations = [];

/*
 * ## enable routing to operation middleware
 */
for (var k in OPERATIONS) {
    // e.g. ./src/{version}/operations/move.js
    app.use(
      OPERATIONS[k],
      require('./operations' + OPERATIONS[k])
    );
    urlOperations.push(OPERATIONS[k]);
}
