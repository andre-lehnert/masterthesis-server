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

var OPERATION = '/bars';

// ---------------- Routing ----------------------------------------------------

/*
 * ## List all receivers
 */
app.get('/', function(req, res) {
  db.getBars(req, res);
});

/*
 * ## Insert new bar
 */
app.post('/', function(req, res) {
  db.insertBar(req, res);
});

/*
 * ## Get bar by label
 */
app.get('/:label', function(req, res) {
  db.getBar(req, res);
});

/*
 * ## Update a bar by label
 */
app.put('/:label', function(req, res) {
  db.updateBar(req, res);
});

/*
 * ## Delete a bar by label
 */
app.delete('/:label', function(req, res) {
  db.deleteBar(req, res);
});
