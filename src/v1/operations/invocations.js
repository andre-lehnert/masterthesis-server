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

var OPERATION = '/invocations';

// ---------------- Routing ----------------------------------------------------

/*
 * ## List all receivers
 */
app.get('/', function(req, res) {
  db.getInvocations(req, res);
});

/*
 * ## Insert new Invocation
 */
app.post('/', function(req, res) {
  db.insertInvocation(req, res);
});

/*
 * ## Get Invocation by id
 */
app.get('/:id', function(req, res) {
  db.getInvocation(req, res);
});

/*
 * ## Update an Invocation by id
 */
app.put('/:id', function(req, res) {
  db.updateInvocation(req, res);
});

/*
 * ## Delete an Invocation by id
 */
app.delete('/:id', function(req, res) {
  db.deleteInvocation(req, res);
});
