// ---------------- Operation --------------------------------------------------
var bodyParser = require('body-parser'),
    express = require('express'),
    // Server
    server = require('./../../../server'),
    URL = server.serverUrl,
    // REST-API-Router
    api = require('./../rest-api'),
    // Database Access (salesforce REST-API)
    db = require('./../database/salesforce/database');
    // Express.js Application
    app = module.exports = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies

// ---------------- API --------------------------------------------------------

var OPERATION = '/tokens';

// ---------------- Routing ----------------------------------------------------

/*
 * ## List all receivers
 */
app.get('/', function(req, res) {
  db.getTokens(req, res);
});

/*
 * ## Insert new token
 */
app.post('/', function(req, res) {
  db.insertToken(req, res);
});

/*
 * ## Get Token by id
 */
app.get('/:label', function(req, res) {
  db.getToken(req, res);
});

/*
 * ## Update an Token by id
 */
app.put('/:label', function(req, res) {
  db.updateToken(req, res);
});

/*
 * ## Delete an Token by id
 */
app.delete('/:label', function(req, res) {
  db.deleteToken(req, res);
});
