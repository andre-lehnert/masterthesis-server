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

var OPERATION = '/devices';

// ---------------- Routing ----------------------------------------------------

/*
 * ## List all receivers
 */
app.get('/', function(req, res) {
  db.getDevices(req, res);
});

/*
 * ## Insert new Device
 */
app.post('/', function(req, res) {
  db.insertDevice(req, res);
});

/*
 * ## Get Device by id
 */
app.get('/:id', function(req, res) {
  db.getDevice(req, res);
});

/*
 * ## Update an Device by id
 */
app.put('/:id', function(req, res) {
  db.updateDevice(req, res);
});

/*
 * ## Delete an Device by id
 */
app.delete('/:id', function(req, res) {
  db.deleteDevice(req, res);
});
