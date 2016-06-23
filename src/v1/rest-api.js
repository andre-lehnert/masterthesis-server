// # Version 1
//
var express = require('express');
var _move = require('./operations/move')
//var customAuth = require('../lib/customAuth')


var app = module.exports = express();

// middleware that only applies to this version of the API
//app.use(customAuth());

// ---------------- VERSION ----------------------------------------------------

var version         = 1, // v0
    author          = 'Andre Lehnert',
    title           = 'REST-API to control a physical 3D barchart over I²C';



// ---------------- ROUTING ----------------------------------------------------

// shows API information
app.get('/', function(req, res) {

    var API =
    {
      'echo' : 'HALLO'
    };


    res.json(API);
})

// ## OPERATION
var OPERATIONS =
{
    'move': '/move'
    // more operations and /operations/js-files
};


// enable routing to operation middleware
for (var k in OPERATIONS) {
    // e.g. ./src/{version}/operations/move.js
    app.use(OPERATIONS[k], require('./operations' + OPERATIONS[k]));
    urlOperations.push(OPERATIONS[k]);
}
