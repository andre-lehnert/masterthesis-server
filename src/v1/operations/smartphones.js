// ---------------- Operation --------------------------------------------------
var bodyParser = require('body-parser'),
    express = require('express'),
    // Server
    server = require('./../../../webserver'),
    URL = server.serverUrl,
    // REST-API-Router
    api = require('./../rest-api'),
    // Database Access (salesforce REST-API)
    db = require('./../database/salesforce/database');
    // Express.js Application
    app = module.exports = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies

// ---------------- API --------------------------------------------------------

var OPERATION = '/smartphones';

// ---------------- Routing ----------------------------------------------------

/*
 * ## List all receivers
 */
app.get('/', function(req, res) {
  db.getSmartphones(req, res);
});

/*
 * ## Insert new Smartphone
 */
app.post('/', function(req, res) {
  db.insertSmartphone(req, res);
});

/*
 * ## Get Smartphone by id
 */
app.get('/:id', function(req, res) {
  db.getSmartphone(req, res);
});

/*
 * ## Update an Smartphone by id
 */
app.put('/:id', function(req, res) {
  db.updateSmartphone(req, res);
});

/*
 * ## Delete an Smartphone by id
 */
app.delete('/:id', function(req, res) {
  db.deleteSmartphone(req, res);
});
