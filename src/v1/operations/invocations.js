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

// ---------------- Operations --------------------------------------------

var requestInvocations = function (req, res, next) {
  db.getInvocations(req, res, next);
};

var requestInvocation = function (req, res, next) {
  db.getInvocation(req, res, next);
};

var insertInvocation = function (req, res, next) {
    db.insertInvocation(req, res, next);
};

var updateInvocation = function (req, res, next) {
    db.updateInvocation(req, res, next);
};

var deleteInvocation = function (req, res, next) {
    db.deleteInvocation(req, res, next);
};

// ---------------- Routing ----------------------------------------------------

/*
 * ## List all receivers
 */
app.get('/', [requestInvocations], function(req, res) {
  res.json(req.response);
});

/*
 * ## Insert new Invocation
 */
app.post('/', [insertInvocation], function(req, res) {
  res.json(req.response);
});

/*
 * ## Get Invocation by id
 */
app.get('/:id', [requestInvocation], function(req, res) {
  res.json(req.response);
});

/*
 * ## Update an Invocation by id
 */
app.put('/:id', [updateInvocation], function(req, res) {
  res.json(req.response);
});

/*
 * ## Delete an Invocation by id
 */
app.delete('/:id', [deleteInvocation], function(req, res) {
  res.json(req.response);
});
