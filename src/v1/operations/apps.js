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

var OPERATION = '/apps';

// ---------------- Routing ----------------------------------------------------

/*
 * ## List all receivers
 */
app.get('/', function(req, res) {
  db.getApps(req, res);
});

/*
 * ## Insert new App
 */
app.post('/', function(req, res) {
  db.insertApp(req, res);
});

/*
 * ## Get App by id
 */
app.get('/:id', function(req, res) {
  db.getApp(req, res);
});

/*
 * ## Update an App by id
 */
app.put('/:id', function(req, res) {
  db.updateApp(req, res);
});

/*
 * ## Delete an App by id
 */
app.delete('/:id', function(req, res) {
  db.deleteApp(req, res);
});
