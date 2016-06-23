// ---------------- Operation --------------------------------------------------

var express = require('express'),
    // Server
    server = require('./../../../server'),
    URL = server.serverUrl,
    // REST-API-Router
    api = require('./../rest-api'),
    // Database Access (salesforce REST-API)
    db = require('./../database/salesforce');
    // Express.js Application
    app = module.exports = express();

// ---------------- API --------------------------------------------------------

var OPERATION = '/light';

// ---------------- Routing ----------------------------------------------------

/*
 * ## List all receivers
 */
app.get('/', function(req, res) {

  db.getBars(req, res);

});
